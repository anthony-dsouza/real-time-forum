package forum

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/bcrypt"
)

type WsLoginResponse struct {
	Label   string `json:"label"`
	Content string `json:"content"`
	Pass    bool   `json:"pass"`
}
type WsLoginPayload struct {
	Label         string `json:"label"`
	NicknameEmail string `json:"name"`
	Password      string `json:"pw"`
	// Conn          *websocket.Conn `json:"-"`
}

func LoginWsEndpoint(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Println("Connected")
	var firstResponse WsLoginResponse
	firstResponse.Label = "Greet"
	firstResponse.Content = "Please login to the Forum"
	conn.WriteJSON(firstResponse)
	listenToLoginWs(conn)
}

func listenToLoginWs(conn *websocket.Conn) {
	defer func() {
		fmt.Println("Ws Conn Closed")
	}()

	var loginPayload WsLoginPayload

	for {
		err := conn.ReadJSON(&loginPayload)
		if err == nil {
			// loginPayload.Conn = conn
			fmt.Printf("payload received: %v\n", loginPayload)
			testLogin()
			ProcessAndReplyLogin(conn, loginPayload)
		}
	}
}

func ProcessAndReplyLogin(conn *websocket.Conn, loginPayload WsLoginPayload) {
	if loginPayload.Label == "login" {
		fmt.Printf("login u: %s: , login pw: %s\n", loginPayload.NicknameEmail, loginPayload.Password)

		// // get user data from db
		var userIDDB int
		var nicknameDB string
		var emailDB string
		var hashDB []byte

		fmt.Printf("%s trying to Login\n", loginPayload.NicknameEmail)
		rows, err := db.Query(`SELECT userID, nickname, email, password 
							FROM users
							WHERE nickname = ?
							OR email = ?`, loginPayload.NicknameEmail, loginPayload.NicknameEmail)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()
		for rows.Next() {
			rows.Scan(&userIDDB, &nicknameDB, &emailDB, &hashDB)
		}

		// // compare pw
		err = bcrypt.CompareHashAndPassword(hashDB, []byte(loginPayload.Password))

		// Login failed
		if err != nil {
			// login failed
			fmt.Println("Failed")
			var failedResponse WsLoginResponse
			failedResponse.Label = "login"
			failedResponse.Content = "record cannot be found"
			failedResponse.Pass = false
			conn.WriteJSON(failedResponse)
			return
		}
		// Login successfully
		fmt.Printf("%s (name from DB) Login successfully\n", loginPayload.NicknameEmail)

		var successResponse WsLoginResponse
		successResponse.Label = "login"
		successResponse.Content = fmt.Sprintf("%s Login successfully", nicknameDB)
		successResponse.Pass = true
		conn.WriteJSON(successResponse)

		// // update the user's login status
		stmt, err := db.Prepare("UPDATE users SET loggedIn = ? WHERE userID = ?;")
		if err != nil {
			log.Fatal(err)
		}
		defer stmt.Close()
		stmt.Exec(true, userIDDB)

	}
}

func testLogin() {
	stmt, err := db.Prepare("INSERT INTO users (userID, nickname, age, gender, firstname, lastname, email, password, loggedIn) VALUES (?,?,?,?,?,?,?,?,?);")
	if err != nil {
		log.Fatal(err)
	}
	testpw := "supersecret"
	testpwHash, err := bcrypt.GenerateFromPassword([]byte(testpw), 10)
	stmt.Exec(0o07, "doubleOhSeven", 42, 1, "James", "Bond", "secretagent@mi5.com", testpwHash, false)
}
func findCurUser() {

}
