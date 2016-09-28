import requests

url = 'http://localhost:8888/level/1/start'
headers = {'Content-Type': 'application/json', 'x-token': 'MS0xNDc0OTc5ODI5Njg3LTg2YWM1NTI1MzU5NWJjMGNmMWI0MTQ0YzM3OTlkZTRm'}
r = requests.post(url, headers=headers)
print(r.text);


url = 'http://localhost:8888/player/status'
headers = {'Content-Type': 'application/json', 'x-token': 'MS0xNDc0OTc5ODI5Njg3LTg2YWM1NTI1MzU5NWJjMGNmMWI0MTQ0YzM3OTlkZTRm'}
r = requests.get(url, headers=headers)
print(r.text);


url = 'http://localhost:8888/player/up'
headers = {'Content-Type': 'application/json', 'x-token': 'MS0xNDc0OTc5ODI5Njg3LTg2YWM1NTI1MzU5NWJjMGNmMWI0MTQ0YzM3OTlkZTRm'}
r = requests.put(url, headers=headers)
print(r.text);


url = 'http://localhost:8888/level/1/end'
headers = {'Content-Type': 'application/json', 'x-token': 'MS0xNDc0OTc5ODI5Njg3LTg2YWM1NTI1MzU5NWJjMGNmMWI0MTQ0YzM3OTlkZTRm'}
r = requests.post(url, headers=headers)
print(r.text);
