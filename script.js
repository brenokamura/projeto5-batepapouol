let name = null;
let recipient = "Todos";
let type = "message";
let lastMessage = null;
let participants = null;
let timeout = null;

const API = "https://mock-api.driven.com.br/api/v6/uol";
const log = document.querySelector(".login");
const loginStarter = log.querySelector(".login-starter");
const loginInput = loginStarter.querySelector("input");
const clickButton = loginStarter.querySelector("button");
const loader = log.querySelector(".loader");
const main = document.querySelector("main");
const aside = document.querySelector("aside");
const people = aside.querySelector(".people");
const input = document.querySelector("footer input");
const sendInfo = document.querySelector(".send-info");
const send = document.querySelector("footer ion-icon");
  

function messageHTML(message) {
    return `
      <div class="messageStatus">
        <p>
          <small class="time">(${message.time})</small> <strong class="from">${message.from}</strong> ${message.text}
        </p>
      </div>
    `;
  }
  
  function defaultMessageHTML(message) {
    return `
      <div class="messageAll">
        <p>
          <small class="time">(${message.time})</small> <strong class="from">${message.from}</strong> para
          <strong class="to">${message.to}</strong>: ${message.text}
        </p>
      </div>
    `;
  }
  
  function privateMessageHTML(message) {
    return `
      <div class="messagePrivate">
        <p>
          <small class="time">(${message.time})</small> <strong class="from">${message.from}</strong> reservadamente
          para <strong class="to">${message.to}</strong>: ${message.text}
        </p>
      </div>
    `;
  }
  
  function loadingMessage() {
    const promise = axios.get(`${API}/messages`);
    promise.then(response => {
      log.classList.add("hidden");
      processMessages(response.data);
      timeout = setTimeout(loadingMessage, 3000);
    });
  }
 
  function processMessages(messages) {
    const filteredMessages = messages.filter(
      message => message.type !== "private_message" || message.from === name || message.to === name
    );
    const mappedMessages = filteredMessages.map(message => {
      if (message.type === "status") {
        return messageHTML(message);
      }
  
      if (message.type === "message") {
        return defaultMessageHTML(message);
      }
  
      return privateMessageHTML(message);
    });
  
    main.innerHTML = "";
    mappedMessages.forEach(message => (main.innerHTML += message));
  
    const realLastMessage = document.querySelector(".msg:last-child");
    if (lastMessage !== realLastMessage.innerText) {
      lastMessage = realLastMessage.innerText;
      realLastMessage.scrollIntoView();
    }
  }
  
  function login() {
    name = loginInput.value;
    loginInput.value = "";
    const promise = axios.post(`${API}/participants`, {name});
    promise.then(response => {
      loginStarter.classList.add("hidden");
      if (loader.classList.contains("hidden")) {
        loader.classList.remove("hidden");
      }
  
      loadingMessage();
      keepLogged();
      getParticipants();
    });
  
    promise.catch(error => {
      loginStarter.classList.add("error-login");
    });
  }
  
  function keepLogged() {
    const promise = axios.post(`${API}/status`, {name});
    promise.then(response => setTimeout(keepLogged, 5000));
    promise.catch(error => window.location.reload());
  }
  
  function sendMessage() {
    const message = {
      from: name,
      to: recipient,
      text: input.value,
      type,
    };
  
    input.value = "";
    const promise = axios.post(`${API}/messages`, message);
    promise.then(response => {
      clearTimeout(timeout);
      loadingMessage();
    });
  }
  
  function renderAside() {
    loadAside();
    toggleAside();
  }

  function getParticipants() {
    const promise = axios.get(`${API}/participants`);
    promise.then(response => {
      participants = response.data;
      if (!participants.includes({name: recipient})) {
        recipient = "Todos";
        reloadSendInfo();
      }
      setTimeout(getParticipants, 10000);
    });
  }
  
  loginInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      clickButton.click();
    }
  });
  
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      send.click();
    }
  });