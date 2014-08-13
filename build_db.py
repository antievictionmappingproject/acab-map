import csv
from pymongo import MongoClient
from datetime import datetime
import json

client = MongoClient()
incidents = client.acab_db.incidents

def do_stuff(year):
    police_file = json.loads( open('sfpd-compiled/sfpd-%d.json' % year).read() )
    for incident in police_file:
        time = incident.pop('Time',None)
        incident['Date'] = datetime.strptime('%s %s' % (incident['Date'], time), '%m/%d/%Y %H:%M' )
        incidents.insert(incident)

if __name__ == "__main__":
    [do_stuff(year) for year in [2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014]]