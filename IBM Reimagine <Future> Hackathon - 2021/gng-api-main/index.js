var ibmdb = require("ibm_db")
  , connStr = "DATABASE=bludb;HOSTNAME=815fa4db-dc03-4c70-869a-a9cc13f33084.bs2io90l08kqb1od8lcg.databases.appdomain.cloud;PORT=30367;PROTOCOL=TCPIP;UID=sfj31202;PWD=tA6AxKwIKH4y0Rfz;Security=SSL";

var ibm = require('ibm-cos-sdk');
var config = {
  endpoint: 's3.jp-tok.cloud-object-storage.appdomain.cloud',
  apiKeyId: 'OJtHaMTrkH4WmZnMwxBdc6hi7_ZH2G57eZ6p0_EZUj_W',
  serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/7b7caa08741f48d0afbb740c1f6d5142:19469154-e0ef-452f-97b5-80d62920079f::',
};
var cos = new ibm.S3(config);

const port = process.env.PORT || 3001;

const express = require('express')
const fs = require('fs')
const app = express()
var nodemailer = require('nodemailer')
app.use(express.json())

app.get('/gng/v1/get-shop-reviews', (req, res) => {
  var shop_id = req.query.shop_id
  console.log(shop_id)
  if (shop_id == null || shop_id == undefined) {
    res.status(400).send({
      "STATUS": "FAILURE",
      "error": "shop_id is required"
    })
  } else {
    var query = "SELECT * FROM REVIEWS where shop_id = '" + shop_id + "'"
    ibmdb.open(connStr, function (err, conn) {
      if (err) {
        console.log(err)
        res.status(500).send({
          "error": "Internal server error"
        })
      } else {
        conn.query(query, function (err, data) {
          if (err) {
            console.log(err)
            res.status(500).send({
              "error": "Internal server error"
            })
          } else {
            res.status(200).send(data)
          }
        })
      }
    })
  }
})

app.post('/gng/v1/getShopRatingsByUser', (req, res) => {
  var customer_id = req.body[0].customer_id
  console.log(customer_id)
  // var customer_id = "59016798-9312-4bee-8fff-d8ab41455ba8"
  if (customer_id == null || customer_id == undefined) {
    res.status(400).send({
      "error": "customer_id is required"
    })
  } else {
    var query = "SELECT * FROM reviews where customer_id = '" + customer_id + "'"
    ibmdb.open(connStr, function (err, conn) {
      if (err) {
        console.log(err)
        res.status(500).send({
          "error": "Internal server error"
        })
      } else {
        conn.query(query, function (err, data) {
          if (err) {
            console.log(err)
            res.status(500).send({
              "error": "Internal server error"
            })
          } else {
            res.status(200).send(data)
          }
        })
      }
    })
  }
})

app.post('/gng/v1/postRatingByUser', (req, res) => {
  var customer_id = req.body.customer_id
  var store_id = req.body.store_id
  var rating = req.body.rating
  var comment = req.body.comment
  if (userId == null || userId == undefined || storeId == null || storeId == undefined || rating == null || rating == undefined) {
    res.status(400).send({
      "error": "userId, storeId and rating are required"
    })
  } else {
    var query = "INSERT INTO store_ratings (customer_id, store_id, rating, comment) VALUES ('" + customer_id + "', '" + store_id + "', '" + rating + "', '" + comment + "') ON DUPLICATE KEY UPDATE rating = '" + rating + "', comment = '" + comment + "'"

    ibmdb.open(connStr, function (err, conn) {
      if (err) {
        console.log(err)
        res.status(500).send({
          "error": "Internal server error"
        })
      } else {
        conn.query(query, function (err, data) {
          if (err) {
            console.log(err)
            res.status(500).send({
              "error": "Internal server error"
            })
          } else {
            res.status(200).send(data)
          }
        })
      }
    })
  }
})

app.post('/gng/v1/create-new-customer', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var customer_id = "'" + req.body.CUSTOMER_ID + "'"
    var customer_name = "'" + req.body.CUSTOMER_NAME + "'"
    var customer_image = "'" + req.body.CUSTOMER_IMAGE + "'"
    var phone_no = "'" + req.body.PHONE_NO + "'"
    var email_id = "'" + req.body.EMAIL_ID + "'"

    var queryStr = "insert into CUSTOMERS values(" + customer_id + "," + customer_name + "," + customer_image + "," + email_id + "," + phone_no + ")"
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else res.sendStatus(200)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.get('/gng/v1/is-shop-present', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var shop_id = "'" + req.query.shop_id + "'"
    var queryStr = "select * from shops where shop_id = " + shop_id
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      res.send(rows)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/create-new-shop', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var shop_id = "'" + req.body.SHOP_ID + "'"
    var shop_name = "'" + req.body.SHOP_NAME + "'"
    var phone_no = "'" + req.body.PHONE_NO + "'"
    var email_id = "'" + req.body.EMAIL_ID + "'"
    var addressLine1 = "'" + req.body.ADDRESS_LINE_1 + "'"
    var addressLine2 = "'" + req.body.ADDRESS_LINE_2 + "'"
    var city = "'" + req.body.CITY + "'"
    var pincode = "'" + req.body.PINCODE + "'"
    var coordinates = "'" + req.body.COORDINATES + "'"
    var about = "'" + req.body.ABOUT + "'"
    var queryStr = "insert into SHOPS values(" + shop_id + "," + shop_name + "," + about + ", 0, " + email_id + "," + phone_no + "," + addressLine1 + "," + addressLine2 + "," + city + "," + pincode + "," + coordinates + ")"
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else res.sendStatus(200)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/get-shop-details', (req, res) => {
  if (req.body.shop_id == null || req.body.shop_id == undefined) {
    res.status(400).send({
      "error": "store_id is required"
    })
  } else {
    ibmdb.open(connStr, function (err, connection) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }

      var shop_id = "'" + req.body.shop_id + "'"
      var queryStr = "select * from SHOPS where SHOP_ID = " + shop_id
      console.log(queryStr)

      connection.query(queryStr, function (err1, rows) {
        console.log(rows[0])
        if (err1) {
          console.log(err1)
          res.sendStatus(500)
        } else res.send(rows[0])
        connection.close(function (err2) {
          if (err2) console.log(err2)
        })
        console.log("Connection Closed")
      })
    })
  }
})

app.post('/gng/v1/update-shop-details', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var shop_id = "'" + req.body.shop_id + "'"
    var shop_name = "'" + req.body.shopName + "'"
    var phone_no = "'" + req.body.phone + "'"
    var addressLine1 = "'" + req.body.addressLine1 + "'"
    var addressLine2 = "'" + req.body.addressLine2 + "'"
    var city = "'" + req.body.city + "'"
    var pincode = "'" + req.body.pincode + "'"
    var coordinates = "'" + req.body.coordinates + "'"
    var about = "'" + req.body.about + "'"
    console.log(req.body)
    var queryStr = "update SHOPS set SHOP_NAME = " + shop_name + ", PHONE_NO = " + phone_no + ", ADDRESS_LINE_1 = " + addressLine1 + ", ADDRESS_LINE_2 = " + addressLine2 + ", CITY = " + city + ", PIN_CODE = " + pincode + ", COORDINATES = " + coordinates + ", ABOUT = " + about + " where SHOP_ID = " + shop_id
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else res.sendStatus(200)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/get-customer-details', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      return res.status(500).send(err)
    }

    var customer_id = "'" + req.body.CUSTOMER_ID + "'"
    console.log(req.body)
    var queryStr = "select * from CUSTOMERS where CUSTOMER_ID = " + customer_id
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        res.sendStatus(500)
      } else {
        if (rows.length == 0) {
          rows = [{ "STATUS": "FAILURE" }]
        } else {
          rows[0] = { "STATUS": "SUCCESS", ...rows[0] }
        }
        res.send(rows[0])
      }
      connection.close(function (err2) {
        // if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/search-by-item', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var item = req.body[0].item;
    console.log(req.body)
    var city = "'" + req.body.city + "'";
    var queryStr = "select AVAILABLE_ITEMS.SHOP_ID, AVAILABLE_ITEMS.SHOP_NAME, SHOPS.CITY, AVAILABLE_ITEMS.ITEM_NAME, AVAILABLE_ITEMS.ITEM_QUANTITY, AVAILABLE_ITEMS.SHOP_RATING, AVAILABLE_ITEMS.ITEM_PRICE from AVAILABLE_ITEMS INNER JOIN SHOPS ON UPPER(AVAILABLE_ITEMS.ITEM_NAME) LIKE UPPER('%" + item + "%') and AVAILABLE_ITEMS.SHOP_ID = SHOPS.SHOP_ID";

    console.log(queryStr);

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else {
        res.send(rows)
      }
      console.log(rows)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/search-by-city', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var city = req.body[0].city
    console.log(req)
    var queryStr = "select AVAILABLE_ITEMS.SHOP_ID, AVAILABLE_ITEMS.SHOP_NAME, SHOPS.CITY, AVAILABLE_ITEMS.ITEM_NAME, AVAILABLE_ITEMS.ITEM_QUANTITY, AVAILABLE_ITEMS.SHOP_RATING, AVAILABLE_ITEMS.ITEM_PRICE from AVAILABLE_ITEMS INNER JOIN SHOPS ON UPPER(SHOPS.CITY) LIKE UPPER('%" + city + "%') and AVAILABLE_ITEMS.SHOP_ID = SHOPS.SHOP_ID";
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else res.send(rows)
      console.log(rows)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/place-order', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var customer_id = "'" + req.body.customer_id + "'"
    var shop_id = "'" + req.body.shop_id + "'"
    var payment_method_id = req.body.payment_method_id
    var order_time = "'" + req.body.order_time + "'"
    var orders = req.body.orders

    // convert string to json array
    orders = JSON.parse(orders)
    console.log(orders)

    // find the data type of orders
    // var orders_type = typeof orders
    // console.log(orders_type)

    var queryStr1 = "insert into ORDERS (CUSTOMER_ID, SHOP_ID, PAYMENT_METHOD_ID, ORDER_TIME) values (" + customer_id + ", " + shop_id + ", " + payment_method_id + ", " + order_time + ")"
    console.log(queryStr1)

    connection.query(queryStr1, function (err1, rows) {
      if (err1) {
        console.log(err1)
      }
    })

    var queryStr2 = "select ORDER_ID from ORDERS where CUSTOMER_ID = " + customer_id + " and SHOP_ID = " + shop_id + " and PAYMENT_METHOD_ID = " + payment_method_id + " and ORDER_TIME = " + order_time
    console.log(queryStr2)

    connection.query(queryStr2, function (err1, rows) {
      if (err1) {
        console.log(err1)
      } else {
        var order_id = rows[0].ORDER_ID
        let name = "'" + orders[0].item_name + "'"
        var queryStr3 = "insert into ORDERED_ITEMS (ORDER_ID, ITEM_NAME, ITEM_QUANTITY, ITEM_IMAGE, ITEM_PRICE) values (" + order_id + ", " + name + ", " + orders[0].item_quantity + ", 'default.png' ,  " + orders[0].item_price + ")"
        for (var i = 1; i < orders.length; i++) {
          name = "'" + orders[i].item_name + "'"
          queryStr3 += ", (" + order_id + ", " + name + ", " + orders[i].item_quantity + ", 'default.png', " + orders[i].item_price + ")"
        }
        console.log(queryStr3)
        connection.query(queryStr3, function (err1, rows) {
          if (err1) {
            console.log(err1)
            return res.send({
              "STATUS": "FAILURE",
              "error": "shop_id is required"
            })
          } else return res.send({
            "STATUS": "SUCCESS"
          })
        })
      }
    })
  })
})

app.get('/gng/v1/get-available-items', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      return res.send(err)
    }

    var queryStr = "select * from AVAILABLE_ITEMS"
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else res.send(rows)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/customer-orders-history', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var customer_id = req.body.customer_id
    var queryStr = "select * from ORDERS_HISTORY where CUSTOMER_ID = '" + customer_id + "'"
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else res.send(rows)
      console.log(rows)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.get('/gng/v1/get-shop-orders', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var shop_id = "'" + req.query.shop_id + "'"
    var queryStr = "select orders.customer_id, orders.payment_method_id, orders.order_time, ordered_items.item_name, ordered_items.item_price, ordered_items.item_quantity, customers.customer_name, customers.phone_no from ORDERS inner join ORDERED_ITEMS on ORDERS.ORDER_ID = ORDERED_ITEMS.ORDER_ID and ORDERS.SHOP_ID = " + shop_id + " inner join CUSTOMERS on ORDERS.CUSTOMER_ID = CUSTOMERS.CUSTOMER_ID"

    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500).send(err1)
      } else {
        console.log(rows)
        var groupedRows = []
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i]
          var found = false
          for (var j = 0; j < groupedRows.length; j++) {
            if (groupedRows[j].CUSTOMER_ID == row.CUSTOMER_ID) {
              found = true
              groupedRows[j].ORDERS.push({
                ITEM_NAME: row.ITEM_NAME,
                ITEM_PRICE: row.ITEM_PRICE,
                ITEM_QUANTITY: row.ITEM_QUANTITY
              })
              break
            }
          }
          if (!found) {
            groupedRows.push({
              CUSTOMER_ID: row.CUSTOMER_ID,
              CUSTOMER_NAME: row.CUSTOMER_NAME,
              PHONE_NO: row.PHONE_NO,
              PAYMENT_METHOD_ID: row.PAYMENT_METHOD_ID,
              ORDER_TIME: row.ORDER_TIME,
              TOTAL_PRICE: 0,
              ORDERS: [{
                ITEM_NAME: row.ITEM_NAME,
                ITEM_PRICE: row.ITEM_PRICE,
                ITEM_QUANTITY: row.ITEM_QUANTITY
              }]
            })
          }
        }

        for (var i = 0; i < groupedRows.length; i++) {
          var totalPrice = 0
          for (var j = 0; j < groupedRows[i].ORDERS.length; j++) {
            totalPrice += groupedRows[i].ORDERS[j].ITEM_PRICE * groupedRows[i].ORDERS[j].ITEM_QUANTITY
          }
          console.log(totalPrice)
          groupedRows[i].TOTAL_PRICE = totalPrice
        }

        console.log(groupedRows)
        res.send(groupedRows)
      }
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})


app.post('gng/v1/api/order-complete', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var order_id = req.body.order_id
    var shop_id = "'" + req.body.shop_id + "'"
    var customer_id = "'" + req.body.customer_id + "'"
  })
})


app.get('/gng/v1/get-shop-orders-history', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var shop_id = "'" + req.query.shop_id + "'"
    var queryStr = "select orders_history.customer_id, orders_history.payment_method_id, orders_history.order_time, ordered_items_history.item_name, ordered_items_history.item_price, ordered_items_history.item_quantity, customers.customer_name, customers.phone_no from ORDERS_HISTORY inner join ORDERED_ITEMS_HISTORY on ORDERS_HISTORY.ORDER_ID = ORDERED_ITEMS_HISTORY.ORDER_ID and ORDERS_HISTORY.SHOP_ID = " + shop_id + " inner join CUSTOMERS on ORDERS_HISTORY.CUSTOMER_ID = CUSTOMERS.CUSTOMER_ID"

    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500).send(err1)
      } else {
        console.log(rows)
        var groupedRows = []
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i]
          var found = false
          for (var j = 0; j < groupedRows.length; j++) {
            if (groupedRows[j].CUSTOMER_ID == row.CUSTOMER_ID) {
              found = true
              groupedRows[j].ORDERS.push({
                ITEM_NAME: row.ITEM_NAME,
                ITEM_PRICE: row.ITEM_PRICE,
                ITEM_QUANTITY: row.ITEM_QUANTITY
              })
              break
            }
          }
          if (!found) {
            groupedRows.push({
              CUSTOMER_ID: row.CUSTOMER_ID,
              CUSTOMER_NAME: row.CUSTOMER_NAME,
              PHONE_NO: row.PHONE_NO,
              PAYMENT_METHOD_ID: row.PAYMENT_METHOD_ID,
              ORDER_TIME: row.ORDER_TIME,
              TOTAL_PRICE: 0,
              ORDERS: [{
                ITEM_NAME: row.ITEM_NAME,
                ITEM_PRICE: row.ITEM_PRICE,
                ITEM_QUANTITY: row.ITEM_QUANTITY
              }]
            })
          }
        }

        for (var i = 0; i < groupedRows.length; i++) {
          var totalPrice = 0
          for (var j = 0; j < groupedRows[i].ORDERS.length; j++) {
            totalPrice += groupedRows[i].ORDERS[j].ITEM_PRICE * groupedRows[i].ORDERS[j].ITEM_QUANTITY
          }
          console.log(totalPrice)
          groupedRows[i].TOTAL_PRICE = totalPrice
        }

        console.log(groupedRows)
        res.send(groupedRows)
      }
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.get('/gng/v1/get-shop-available-items', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      return res.status(500).send(err)
    }

    var shop_id = "'" + req.query.shop_id + "'"
    var queryStr = "select ITEM_NAME, ITEM_QUANTITY, ITEM_PRICE from AVAILABLE_ITEMS where SHOP_ID = " + shop_id
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else res.send(rows)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/add-item', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var item_name = "'" + req.body.ITEM_NAME + "'"
    var item_price = req.body.ITEM_PRICE
    var item_quantity = req.body.ITEM_QUANTITY
    var shop_id = "'" + req.body.SHOP_ID + "'"
    var shop_name = "'" + req.body.SHOP_NAME + "'"
    var queryStr = "insert into AVAILABLE_ITEMS values (" + shop_id + ", " + shop_name + ", 4, " + item_name + ", " + item_quantity + ", " + item_price + ", 'default.png')"
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else res.send(rows)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/edit-item', (req, res) => {
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    console.log(req.query)
    console.log(req.body)

    var item_name = "'" + req.body.ITEM_NAME + "'"
    var item_price = req.body.ITEM_PRICE
    var item_quantity = req.body.ITEM_QUANTITY
    var shop_id = "'" + req.body.SHOP_ID + "'"
    var edited_item_name = "'" + req.body.edited_item_name + "'"
    var queryStr1 = "delete from AVAILABLE_ITEMS where ITEM_NAME = " + edited_item_name + " and SHOP_ID = " + shop_id
    var queryStr2 = "insert into AVAILABLE_ITEMS values (" + shop_id + ", " + item_name + ", " + item_quantity + ", " + item_price + ")"
    console.log(queryStr1)
    console.log(queryStr2)

    connection.query(queryStr1, function (err1, rows) {
      if (err1) console.log(err1)
    })

    connection.query(queryStr2, function (err1, rows) {
      if (err1) console.log(err1)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/delete-item', (req, res) => {
  console.log(req.body)
  ibmdb.open(connStr, function (err, connection) {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    var item_name = "'" + req.body.ITEM_NAME + "'"
    var shop_id = "'" + req.body.SHOP_ID + "'"
    var queryStr = "delete from AVAILABLE_ITEMS where SHOP_ID = " + shop_id + " and ITEM_NAME = " + item_name
    console.log(queryStr)

    connection.query(queryStr, function (err1, rows) {
      if (err1) {
        console.log(err1)
        res.sendStatus(500)
      } else res.send(rows)
      connection.close(function (err2) {
        if (err2) console.log(err2)
      })
      console.log("Connection Closed")
    })
  })
})

app.post('/gng/v1/send-email', (req, res) => {
  console.log(req.body)

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sparkInc375@gmail.com',
      pass: ''
    }
  });

  var mailOptions = {
    from: 'sparkInc375@gmail.com',
    to: req.body.email,
    subject: 'GnG team',
    text: 'Your query has been received. We will get back to you soon.'
  };

  var mailOptions2 = {
    from: 'sparkInc375@gmail.com',
    to: 'naredd_861928@student.nitw.ac.in, sappa_971963@student.nitw.ac.in ',
    subject: req.body.subject,
    text: req.body.message
  };
})

app.post('/gng/v1/send-image', (req, res) => {
  // read image from local storage and make it into base64
  var fs = require('fs');
  // var file = fs.readFileSync('./image2.jpg');
  //get a image file from request
  var file = req.body.image;
  console.log(req)

  // insert an image into the bucket
  var params = {
    Bucket: 'cloud-object-storage-2t-cos-standard-i61',
    Key: 'Raghu.png',
    Body: file,
  };
  cos.putObject(params, function (err, data) {
    if (err) {
      console.log('err');
      console.log(err);
    } else {
      console.log('success');
      console.log(data);
    }
  });
})

app.post('/gng/v1/get_image', (req, res) => {

  // get the image from the bucket
  var params = {
    Bucket: 'cloud-object-storage-2t-cos-standard-i61',
    Key: req.body.id + '.jpg'
  };

  console.log(params)
  cos.getObject(params, function (err, data) {
    if (err) {
      console.log('err');
      console.log(err);
    } else {
      console.log('success');
      console.log(data);

      // convert the buffer into image.png and send it to client
      var base64Data = data.Body.toString('base64');
      var image = new Buffer(base64Data, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': image.length
      });
      res.end(image);
    }
  });
});

// Start server 
app.listen(port, () => {
	console.log("Listening on http://localhost:" + port)
});
