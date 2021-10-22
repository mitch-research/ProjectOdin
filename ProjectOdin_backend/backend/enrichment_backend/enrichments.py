from flask import Flask
from flask import request
from flask_cors import CORS

import requests

import pandas as pd
from datalake_tools.hunter import *
from datalake_tools.hunter import RESEARCH_US_DATALAKE_CONFIG
from datetime import datetime

print(f'[-] Enrichment server started!')
db_serverport = 'http://mitchelle.s1.research-dep:3001'


datadir = './datalake_data/'

dlc = DataLakeClient(config=RESEARCH_US_DATALAKE_CONFIG, base_dir=datadir, n_jobs=10)
print(f'[-] Initialized DLC')

mgmts = dlc.fetch_all_mgmts()
print(f'[-] Fetched managements')
query = """
select * 
from hive_datalake.views.dv_events_table_mgmts
where sha256 is not NULL
limit 200
"""

col_df = dlc.query(query)
print(f'[-] Run initial query')
columns_sha256 = col_df.columns[(col_df.columns.str.contains('sha256'))].array
columns_sha1 = col_df.columns[(col_df.columns.str.contains('sha1'))].array
columns_md5 = col_df.columns[(col_df.columns.str.contains('md5'))].array

print(f'[-] SHA256 Columns: {len(columns_sha256)}\nSHA1 Columns: {len(columns_sha1)}\nMD5 Columns: {len(columns_md5)}\n')

print(f'[-] Length of managements list: {len(mgmts)}')


app = Flask(__name__)
CORS(app)






@app.route("/enrichments/s1_ip", methods=['POST'])
def s1_ip():
    return {'message':'Success'}

@app.route('/enrichments/s1_hash', methods=['POST'])
def s1_hash():
    

    body = request.get_json()

    

    testmgmt = 'fao.sentinelone.net'
    earliest_date = '2021-10-14'

    curhash = body['hash']

    queries = []

    for column in columns_sha1:
                query = f"""
                            select ts, mgmt_addr, meta_uuid, meta_event_name, 
                            meta_mgmturl, events_enrichment_target_process_node_key_value, 
                            {column}, meta_agent_name, events_timestamp_millisecondssinceepoch
                            from hive_datalake.views.dv_events_table_mgmts
                            where {column} in ('{curhash}') and
                            ts >= '{earliest_date}' and 
                            mgmt_addr = '{testmgmt}'
                            limit 1000
                        """
                queries.append(query)

    print(f'[-] Total of {len(queries)} queries!')

    df = dlc.query(queries, 'queries_for_testing_odin')
    rows = []
    for row in df.itertuples():
        rows.append(row)
    print(f'[-] Total columns: {len(df.columns)}')
    print(f'[-] Total rows: {len(rows)}')


    newNodes = []
    
    notPrint = True
    for index, row in df.iterrows():
        hashes_present = False
        
        obj = {
            'basic_date':row['ts'],
            'timestamp':row['events_timestamp_millisecondssinceepoch'],
            'mgmt':row['mgmt_addr'],
            'event_name':row['meta_event_name'],
            'uuid':row['meta_event_name']+':'+row['mgmt_addr']+':'+str(row['events_timestamp_millisecondssinceepoch'])
        }
        print(f"[-] {row['ts']} - {row['mgmt_addr']} - {row['meta_uuid']} - {row['meta_agent_name']} - EVENT:{row['meta_event_name']} - TIMESTAMP:{row['events_timestamp_millisecondssinceepoch']}")
        if row['meta_event_name'] == 'MALICIOUSFILE' and notPrint:
            hashes_present = True
            
            query = f"""
                            select events_enrichment_targetfile_hashes_md5, events_enrichment_targetfile_hashes_sha256,
                            events_enrichment_targetfile_hashes_sha1, events_timestamp_millisecondssinceepoch
                            from hive_datalake.views.dv_events_table_mgmts
                            where ts >= '{row['ts']}' and
                            mgmt_addr = '{testmgmt}'
                            limit 1000
                        """

            
            df2 = dlc.query(query)
            
            for index, row2 in df2.iterrows():
                if notPrint:
                    md5 = row2['events_enrichment_targetfile_hashes_md5']
                    sha1 = row2['events_enrichment_targetfile_hashes_sha1']
                    sha256 = row2['events_enrichment_targetfile_hashes_sha256']
                    if md5 != None and sha1 != None and sha256 != None:
                        print(f'\tMD5: {md5}\n\tSHA1: {sha1}\n\tSHA256: {sha256}')
                        obj['hashes'] = {
                            'md5':md5,
                            'sha1':sha1,
                            'sha256':sha256
                        }
                        notPrint = False
        newNodes.append(obj)

    for item in newNodes:
        create = {'type':f's1_event:{item["event_name"]}', 'value':item['uuid']}
        desc = f"""
            Management: {item['mgmt']}
            Timestamp: {item['timestamp']}
        """
        create['desc'] = desc 
        requests.post(db_serverport+'/createObj', json=create)
        addRel = {
            'root':curhash,
            'node_type':'hash',
            'related':[
                {
                    'node_type':f's1_event:{item["event_name"]}',
                    'value':f'{item["uuid"]}',
                    'rel_type':f'`S1 Enrichment from {item["mgmt"]}`'
                }
            ]
        }
        requests.post(db_serverport+'/addRel', json=addRel)
        try:
            hashes = item['hashes']
            for k, v in hashes.items():
                create = {'type':f'hash','value':v}
                desc = f""" {k} Hash\n
                    Added during enrichment, found in management {item['mgmt']}\n
                    Timestamp: {item['timestamp']}\n
                    UUID of related event: {item['uuid']}
                """
                create['desc'] = desc 
                requests.post(db_serverport+'/createObj', json=create)
                addRel = {
                    'root':v,
                    'node_type':'hash',
                    'related':[
                        {
                            'node_type':f's1_event',
                            'value':f'{item["uuid"]}',
                            'rel_type':f'`S1 Enrichment from {item["mgmt"]}`'
                        }, 
                        {
                            'node_type':'hash',
                            'value':f'{curhash}',
                            'rel_type':f'`S1 Enrichment from {item["mgmt"]}`'
                    
                        }
                    ]
                }
                requests.post(db_serverport+'/addRel', json=addRel)
        except Exception as e:
            print(f'[x] Exception: '+str(e))


        # Add relationships
    return {'message':'Success'}



# Augury
@app.route('/enrichments/augury', methods=['POST'])
def augury():
    print('hit augury endpoint')
    # Create the job


    # Wait for the job to finish


    # Format the results


    # Send the results
    return {'message':'Success'}
    

