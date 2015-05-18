#!/usr/bin/python
import random
import math

hosts = [1, 2, 3, 4, 5, 7] # Choose 3 elements
print hosts
dim = int(math.ceil(len(hosts) / 2))
print dim
print random.sample(hosts, dim )