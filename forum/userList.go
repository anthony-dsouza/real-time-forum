package forum

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

type WsUserListResponse struct {
	Label       string       `json:"label"`
	Content     string       `json:"content"`
	OnlineUsers []userStatus `json:"online_users"`
}

type WsUserListPayload struct {
	Label       string         `json:"label"`
	Content     string         `json:"content"`
	CookieValue string         `json:"cookie_value"`
	Conn        websocket.Conn `json:"-"`
}

type userStatus struct {
	Nickname string `json:"nickname"`
	LoggedIn bool   `json:"status"`
	UserID   int    `json:"userID"`
}

var (
	userListPayloadChan = make(chan WsUserListPayload)
	userListWsMap       = make(map[*websocket.Conn]int)
)

func userListWsEndpoint(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Println("UL Connected")

	readUserListPayloadFromWs(conn)
}

func readUserListPayloadFromWs(conn *websocket.Conn) {
	defer func() {
		fmt.Println("UserList Ws Conn Closed")
	}()

	var userListPayload WsUserListPayload
	for {
		// fmt.Print("ul ")
		err := conn.ReadJSON(&userListPayload)
		if err == nil {
			fmt.Printf("Sending userListPayload thru chan: %v\n", userListPayload)
			userListPayload.Conn = *conn
			userListPayloadChan <- userListPayload
		}
	}
}

func ProcessAndReplyUserList() {
	for {
		receivedUserListPayload := <-userListPayloadChan
		payloadLabels := strings.Split(receivedUserListPayload.Label, "-")
		fmt.Println("------------------------------ PAYLOAD", payloadLabels)
		// close and remove conn from map if logout
		if len(payloadLabels) > 1 && payloadLabels[1] == "logout" {
			_ = receivedUserListPayload.Conn.Close()
			delete(userListWsMap, &receivedUserListPayload.Conn)
		}

		if len(payloadLabels) == 1 && payloadLabels[0] == "update" {
			// find which userID
			var loggedInUid int
			rows, err := db.Query("SELECT userID FROM sessions WHERE sessionID = ?;", receivedUserListPayload.CookieValue)
			if err != nil {
				log.Fatal(err)
			}
			defer rows.Close()
			for rows.Next() {
				rows.Scan(&loggedInUid)
			}
			fmt.Printf("loggedInUid UL %d \n", loggedInUid)
			// store conn in websockets table
			// stmt, err := db.Prepare(`INSERT INTO websockets
			// 					(userID, websocketAdd, usage)
			// 					VALUES (?, ?, ?);`)
			// if err != nil {
			// 	log.Fatal(err)
			// }
			// defer stmt.Close()
			// fmt.Printf("uid: %d, Conn: %v, usage %s \n", loggedInUid, receivedUserListPayload.Conn, "userlist")
			// stmt.Exec(loggedInUid, receivedUserListPayload.Conn, "userlist")

			// store conn in map
			userListWsMap[&receivedUserListPayload.Conn] = loggedInUid
			fmt.Printf("current map: %v", userListWsMap)
		}

		updateUList()
	}
}

func updateUList() {
	var userListResponse WsUserListResponse
	userListResponse.Label = "update"

	rows, err := db.Query(`SELECT nickname, loggedIn, userID   FROM users`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	var userStatusDBArr []userStatus
	for rows.Next() {
		var nicknameDB string
		var loggedInDB bool
		var UserIDDB int

		rows.Scan(&nicknameDB, &loggedInDB, &UserIDDB)
		fmt.Println(UserIDDB)
		userStatusElement := struct {
			Nickname string `json:"nickname"`
			LoggedIn bool   `json:"status"`
			UserID   int    `json:"userID"`
		}{
			nicknameDB,
			loggedInDB,
			UserIDDB,
		}
		userStatusDBArr = append(userStatusDBArr, userStatusElement)
	}

	fmt.Printf("UL nicknames: %v\n", userStatusDBArr)
	userListResponse.OnlineUsers = userStatusDBArr
	broadcast(userListResponse)
}

func broadcast(userListResponse WsUserListResponse) {
	for userListWs := range userListWsMap {
		userListWs.WriteJSON(userListResponse)
	}
	// rows, err := db.Query(`SELECT websocketAdd FROM websockets`) // WHERE usage = userlist
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer rows.Close()
	// var wsArr []*websocket.Conn
	// for rows.Next() {
	// 	var wsAdd *websocket.Conn
	// 	rows.Scan(&wsAdd)
	// 	wsArr = append(wsArr, wsAdd)
	// }
	// for _, wsAddress := range wsArr {
	// 	wsAddress.WriteJSON(userListResponse)
	// }
}
