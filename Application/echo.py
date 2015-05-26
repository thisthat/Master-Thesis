import urllib.request

print("Start")
res = urllib.request.urlopen("http://127.0.0.1").read().decode('utf-8')
print(res)