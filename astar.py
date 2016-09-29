level = 7
sf = []

if level == 3:
    n = 500 # horizontal size of the map
    m = 500 # vertical size of the map

    # start and destination
    sf.append((3, 3, 462, 485))

if level == 2:
    n = 150 # horizontal size of the map
    m = 150 # vertical size of the map

    # start and destination
    sf.append((3, 3, 138, 139))

if level == 7:
    n = 200 # horizontal size of the map
    m = 200 # vertical size of the map

    # start and destination
    sf.append((10, 190, 1, 1))


import csv
# with open(str(level) + '.csv', 'rb') as f:
#     reader = csv.reader(f)
#     grid = list(reader)

# A* Shortest Path Algorithm
# http://en.wikipedia.org/wiki/A*
# FB - 201012256
from heapq import heappush, heappop # for priority queue
import math
import time
import random
import requests

class node:
    xPos = 0 # x position
    yPos = 0 # y position
    idistance = 0 # total distance already travelled to reach the node
    priority = 0 # priority = distance + remaining distance estimate
    def __init__(self, xPos, yPos, distance, priority):
        self.xPos = xPos
        self.yPos = yPos
        self.distance = distance
        self.priority = priority
    def __lt__(self, other): # comparison method for priority queue
        return self.priority < other.priority
    def updatePriority(self, xDest, yDest):
        self.priority = self.distance + self.estimate(xDest, yDest) * 10 # A*
    # give higher priority to going straight instead of diagonally
    def nextMove(self, dirs, d, weight): # d: direction to move
        if dirs == 8 and d % 2 != 0:
            self.distance += 14
        else:
            self.distance += 10 * weight
    # Estimation function for the remaining distance to the goal.
    def estimate(self, xDest, yDest):
        xd = xDest - self.xPos
        yd = yDest - self.yPos
        # Euclidian Distance
        d = math.sqrt(xd * xd + yd * yd)
        # Manhattan distance
        # d = abs(xd) + abs(yd)
        # Chebyshev distance
        # d = max(abs(xd), abs(yd))
        return(d)

# A-star algorithm.
# The path returned will be a string of digits of directions.
def pathFind(the_map, n, m, dirs, dx, dy, xA, yA, xB, yB):
    closed_nodes_map = [] # map of closed (tried-out) nodes
    open_nodes_map = [] # map of open (not-yet-tried) nodes
    dir_map = [] # map of dirs
    row = [0] * n
    for i in range(m): # create 2d arrays
        closed_nodes_map.append(list(row))
        open_nodes_map.append(list(row))
        dir_map.append(list(row))

    pq = [[], []] # priority queues of open (not-yet-tried) nodes
    pqi = 0 # priority queue index
    # create the start node and push into list of open nodes
    n0 = node(xA, yA, 0, 0)
    n0.updatePriority(xB, yB)
    heappush(pq[pqi], n0)
    open_nodes_map[yA][xA] = n0.priority # mark it on the open nodes map

    # A* search
    while len(pq[pqi]) > 0:
        # get the current node w/ the highest priority
        # from the list of open nodes
        n1 = pq[pqi][0] # top node
        n0 = node(n1.xPos, n1.yPos, n1.distance, n1.priority)
        x = n0.xPos
        y = n0.yPos
        heappop(pq[pqi]) # remove the node from the open list
        open_nodes_map[y][x] = 0
        closed_nodes_map[y][x] = 1 # mark it on the closed nodes map

        # quit searching when the goal is reached
        # if n0.estimate(xB, yB) == 0:
        if x == xB and y == yB:
            # generate the path from finish to start
            # by following the dirs
            path = ''
            while not (x == xA and y == yA):
                j = dir_map[y][x]
                c = str((j + dirs / 2) % dirs)
                path = c + path
                x += dx[j]
                y += dy[j]
            return path

        # generate moves (child nodes) in all possible dirs
        for i in range(dirs):
            xdx = x + dx[i]
            ydy = y + dy[i]
            if not (xdx < 0 or xdx > n-1 or ydy < 0 or ydy > m - 1
                    or the_map[ydy][xdx] == '1' or closed_nodes_map[ydy][xdx] == 1):
                # generate a child node
                weight = 1

                if the_map[ydy][xdx] == '#':
                    weight = 50000

                m0 = node(xdx, ydy, n0.distance, n0.priority)
                m0.nextMove(dirs, i, weight)
                m0.updatePriority(xB, yB)
                # if it is not in the open list then add into that
                if open_nodes_map[ydy][xdx] == 0:
                    open_nodes_map[ydy][xdx] = m0.priority
                    heappush(pq[pqi], m0)
                    # mark its parent node direction
                    dir_map[ydy][xdx] = (i + dirs / 2) % dirs
                elif open_nodes_map[ydy][xdx] > m0.priority:
                    # update the priority
                    open_nodes_map[ydy][xdx] = m0.priority
                    # update the parent direction
                    dir_map[ydy][xdx] = (i + dirs / 2) % dirs
                    # replace the node
                    # by emptying one pq to the other one
                    # except the node to be replaced will be ignored
                    # and the new node will be pushed in instead
                    while not (pq[pqi][0].xPos == xdx and pq[pqi][0].yPos == ydy):
                        heappush(pq[1 - pqi], pq[pqi][0])
                        heappop(pq[pqi])
                    heappop(pq[pqi]) # remove the target node
                    # empty the larger size priority queue to the smaller one
                    if len(pq[pqi]) > len(pq[1 - pqi]):
                        pqi = 1 - pqi
                    while len(pq[pqi]) > 0:
                        heappush(pq[1-pqi], pq[pqi][0])
                        heappop(pq[pqi])
                    pqi = 1 - pqi
                    heappush(pq[pqi], m0) # add the better node instead
    return '' # if no route found

def startLevel(i):
    url = 'http://10.21.0.195:8888/level/' + str(i) + '/start'
    headers = {'Content-Type': 'application/json', 'x-token': 'MS0xNDc0OTc5ODI5Njg3LTg2YWM1NTI1MzU5NWJjMGNmMWI0MTQ0YzM3OTlkZTRm'}
    r = requests.post(url, headers=headers)
    print(r.text)
    return r.text

def endLevel(i):
    url = 'http://10.21.0.195:8888/level/' + str(i) + '/end'
    headers = {'Content-Type': 'application/json', 'x-token': 'MS0xNDc0OTc5ODI5Njg3LTg2YWM1NTI1MzU5NWJjMGNmMWI0MTQ0YzM3OTlkZTRm'}
    r = requests.post(url, headers=headers)
    print(r.text);

def getStatus():
    url = 'http://10.21.0.195:8888/player/status'
    headers = {'Content-Type': 'application/json', 'x-token': 'MS0xNDc0OTc5ODI5Njg3LTg2YWM1NTI1MzU5NWJjMGNmMWI0MTQ0YzM3OTlkZTRm'}
    r = requests.get(url, headers=headers)
    print(r.text);

def movePlayer(direction):
    url = 'http://10.21.0.195:8888/player/' + direction
    headers = {'Content-Type': 'application/json', 'x-token': 'MS0xNDc0OTc5ODI5Njg3LTg2YWM1NTI1MzU5NWJjMGNmMWI0MTQ0YzM3OTlkZTRm'}
    r = requests.put(url, headers=headers)

def interact():
    url = 'http://10.21.0.195:8888/player/interact'
    headers = {'Content-Type': 'application/json', 'x-token': 'MS0xNDc0OTc5ODI5Njg3LTg2YWM1NTI1MzU5NWJjMGNmMWI0MTQ0YzM3OTlkZTRm'}
    r = requests.put(url, headers=headers)

def measureRoom(coords, the_map, visited):
    if (the_map[coords['y']][coords['x']] != '.' and the_map[coords['y']][coords['x']] != 'B'):
        return 0
    else:
        for vi in visited:
            if (coords['y'] == vi['y'] and coords['x'] == vi['x']):
                return 0

        coordsup = { 'y': coords['y'] - 1, 'x': coords['x'] }
        coordsdown = { 'y': coords['y'] + 1, 'x': coords['x'] }
        coordsleft = { 'y': coords['y'], 'x': coords['x'] - 1 }
        coordsright = { 'y': coords['y'], 'x': coords['x'] + 1 }
        visited.append(coords)
        return 1 + measureRoom(coordsup, the_map, visited) + measureRoom(coordsdown, the_map, visited) + measureRoom(coordsleft, the_map, visited) + measureRoom(coordsright, the_map, visited)

def searchButton(coords, the_map, visited):
    if  the_map[coords['y']][coords['x']] == 'B':
        return coords
    elif the_map[coords['y']][coords['x']] != '.':
        return None;
    else:
        for vi in visited:
            if (coords['y'] == vi['y'] and coords['x'] == vi['x']):
                return None

        coordsup = { 'y': coords['y'] - 1, 'x': coords['x'] }
        coordsdown = { 'y': coords['y'] + 1, 'x': coords['x'] }
        coordsleft = { 'y': coords['y'], 'x': coords['x'] - 1 }
        coordsright = { 'y': coords['y'], 'x': coords['x'] + 1 }
        visited.append(coords)
        up = searchButton(coordsup, the_map, visited)
        down = searchButton(coordsdown, the_map, visited)
        left = searchButton(coordsleft, the_map, visited)
        right = searchButton(coordsright, the_map, visited)

        if up is not None:
            return up
        if down is not None:
            return down
        if left is not None:
            return left
        if right is not None:
            return right

# MAIN
dirs = 4 # number of possible directions to move on the map
if dirs == 4:
    dx = [1, 0, -1, 0]
    dy = [0, 1, 0, -1]
elif dirs == 8:
    dx = [1, 1, 0, -1, -1, -1, 0, 1]
    dy = [0, 1, 1, 1, 0, -1, -1, -1]

the_map = []
row = [0] * n
for i in range(m): # create empty map
    the_map.append(list(row))

# fillout the map with a '+' pattern
for x in range(n / 8, n * 7 / 8):
    the_map[m / 2][x] = 1
for y in range(m/8, m * 7 / 8):
    the_map[y][n / 2] = 1

# randomly select start and finish locations from a list

abc = startLevel(level)

import json
parsed_json = json.loads(abc)
the_map = parsed_json['map']
x = 0
doors = []
for linei in range(len(the_map)):
    line = the_map[linei]
    for tilei in range(len(line)):
        tile = line[tilei]
        if tile == 'D':
            print('x', tilei, 'y', linei, 'door')
            doors.append({'x': tilei, 'y': linei})
print(doors)

buttons = []

for door in doors:
    firsttile = { 'y': door['y'] - 1, 'x': door['x'] }
    size = measureRoom(firsttile, the_map, [])
    if size == 19:
        print('ROFL', door)
        buttontile = searchButton(firsttile, the_map, [])
        print buttontile
        buttons.append(buttontile)

startx = 10
starty = 190
routes = []

for button in buttons:
    (xA, yA, xB, yB) = (startx, starty, button['x'], button['y'])
    route = pathFind(the_map, n, m, dirs, dx, dy, xA, yA, xB, yB)
    startx = button['x']
    starty = button['y']
    routes.append(route)

print routes

# b = doors.pop()
# print(b)
# firsttile = { 'y': b['y'] - 1, 'x': b['x'] }
# print firsttile
# size = measureRoom(firsttile, the_map, [])
# print size

# the_map = grid
# print 'Map size (X,Y): ', n, m
# print 'Start: ', xA, yA
# print 'Finish: ', xB, yB
# t = time.time()
# print 'Time to generate the route (seconds): ', time.time() - t
# print 'Route:'
# print route
#
#
# # mark the route on the map
for route in routes:
    if len(route) > 0:
        x = 10
        y = 190
        for i in range(len(route)):
            j = int(route[i])
            x += dx[j]
            y += dy[j]

            if dy[j] == 1:
                # print 'down'
                movePlayer("down")
            if dy[j] == -1:
                # print 'up'
                movePlayer("up")
            if dx[j] == 1:
                # print 'right'
                movePlayer("right")
            if dx[j] == -1:
                # print 'left'
                movePlayer("left")
        interact()
        print 'pushed button'

endLevel(level)
#
# # display the map with the route added
# print 'Map:'
# for y in range(m):
#     for x in range(n):
#         xy = the_map[y][x]
#         if xy == '0':
#             print '.', # space
#         elif xy == '1':
#             print '+', # obstacle
#         elif xy == '2':
#             print 't', # start
#         elif xy == '3':
#             print 'A', # route
#         elif xy == '4':
#             print ' ', # finish
#     print
#
# raw_input('Press Enter...')
