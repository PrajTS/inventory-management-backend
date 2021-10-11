# Inventory management backend - express.js



## Steps to run

```
1. npm install
2. npm start
```



## Endpoints

1. **/v1/auth/login** - POST - Accept username and password and initiate **session** login
2. **/v1/auth/me** - GET - Check cookies to check whether a session already exists
3. **/v1/auth/logout** - GET - Destory user session
4. **/v1/inventory** - GET - Get list of inventory items
5. **/v1/inventory/:id** - GET - Get inventory item detail with the sent **id**
6. **/v1/inventory/:id** - DELETE - Delete inventory item with the sent **id**
7. **/v1/inventory** - POST - Add new inventory item