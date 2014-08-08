import csv
from pymongo import MongoClient
from datetime import datetime

client = MongoClient()

incidents = client.acab_db.incidents

"""
Things to check:
- Compile types of incidents
- Aggregate stuff, idfk, just get the things in a db first
"""

def do_stuff(year):
    police_file = csv.DictReader(open('sfpd/sfpd_incident_with_zip_%d.csv' % year))
    for incident in police_file:
        time = incident.pop('Time',None)
        incident['Date'] = datetime.strptime('%s %s' % (incident['Date'], time), '%m/%d/%Y %H:%M' )
        incidents.insert(incident)

#[do_stuff(year) for year in [2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014]]

def incident_types(year):
    return incidents.aggregate([
        { '$match' : {'ZIP':'94110', 'Date': {'$gte':datetime(year,1,1),'$lte':datetime(year,12,31)} } },
        { '$group' : {"_id":"$Resolution", "count":{"$sum":1} } },
        { '$sort' : {'count':-1} }
    ])


def danger(year):
    return incidents.find({'Date': {'$gte':datetime(year,1,1),'$lte':datetime(year,12,31)}, 'Descript':'DANGER OF LEADING IMMORAL LIFE', 'Resolution':'JUVENILE BOOKED' })

def juveniles(year):
    return incidents.aggregate([
        { '$match' : {'Date': {'$gte':datetime(year,1,1),'$lte':datetime(year,12,31)}, 'Resolution':'JUVENILE BOOKED' } },
        { '$group' : {"_id":"$Descript", "count":{"$sum":1} } },
        { '$sort' : {'count':-1} }
    ])

"""
Quality of life crimes
    -Drunk in 
Number of officers
"""