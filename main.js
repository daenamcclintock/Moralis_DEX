/** Connect to Moralis server */
const serverUrl = "https://zszvwhvkt9vz.usemoralis.com:2053/server";
const appId = "gWAfANE8Xv9Fkt9IRBXeKy2jJNQUSpshS1U1jlsF";

let currentTrade = {}
let currentSelectSide
let tokens

const init = async () => {
    await Moralis.start({ serverUrl, appId })
    await Moralis.enableWeb3()
    await listAvailableTokens()
    currentUser = Moralis.User.current()
    if (currentUser) {
      document.getElementById("swap_button").disabled = false
    }
}

const listAvailableTokens = async () => {
    const result = await Moralis.Plugins.oneInch.getSupportedTokens({
        chain: "eth" // change based on blockchain to use (eth, bsc, polygon)
    })

    tokens = result.tokens
    let tokenList = document.getElementById("token_list")
    for (const address in tokens) {
        let token = tokens[address]
        let div = document.createElement("div")
        div.setAttribute("data-address", address)
        div.className = "token_row"
        let html = `
            <img class="token_list_img" src="${token.logoURI}" />
            <span class="token_list_text">${token.symbol}</span>
        `
        div.innerHTML = html
        div.onclick = () => {
            selectToken(address)
        }
        tokenList.appendChild(div)
    }
}

const selectToken = (address) => {
    closeModal()
    console.log(tokens)
    currentTrade[currentSelectSide] = tokens[address]
    console.log(currentTrade)
    renderInterface()
    getQuote()
}

const renderInterface = () => {
    if (currentTrade.from) {
        document.getElementById("from_token_img").src = currentTrade.from.logoURI
        document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol
    }
    if (currentTrade.to) {
        document.getElementById("to_token_img").src = currentTrade.to.logoURI
        document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol
    }
}

const login = async () => {
    try {
        currentUser = Moralis.User.current();
        if (!currentUser) {
            currentUser = await Moralis.authenticate();
        }
        document.getElementById("swap_button").disabled = false;
    } 
    catch (error) {
        console.error(error);
    }
}

const openModal = () => {
    currentSelectSide = side;
    document.getElementById("token_modal").style.display = "block";
}

const logOut = async () => {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;