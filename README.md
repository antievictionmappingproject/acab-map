We're mapping police activity and gentrification indicators.

### How to use this repo

Here's the install waterfall if you have Mac OS X:

**(terminal commands in bold)**

1. [Homebrew](http://brew.sh/) - An OSX package manager
2. [Python](https://www.python.org/downloads/) - A language used by MongoDB
3. [MongoDB](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) - With Homebrew: **brew update** + **brew install mongodb**
4. [Pip](https://pypi.python.org/pypi/pip) - A Python package manager (if you've installed Python, Pip should already be installed)
5. **pip install -r requirements.txt** - Installs the dependencies for this repo
6. Download the [SFPD data repo](https://github.com/antievictionmappingproject/sfpd-data)'s zip file, unzip it, and put the resulting folder into your local machine's top-level directory for this repo (the folder where .gitignore and robots.txt live)
7. Start MongoDB: **sudo mongod** (may need to run **sudo mongod repair**)
8. In a new window start Matthew's script, which builds a MongoDB database out of the SFPD data: **python build_db.py**

Other instructions can be found in the wiki: https://github.com/antievictionmappingproject/acab-map/wiki.
