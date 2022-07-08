/** Connect to Moralis server */
const serverUrl = "https://zszvwhvkt9vz.usemoralis.com:2053/server";
const appId = "gWAfANE8Xv9Fkt9IRBXeKy2jJNQUSpshS1U1jlsF";

async function init() {
    await Moralis.start({ serverUrl, appId });
    await Moralis.enableWeb3();
    await listAvailableTokens();
    currentUser = Moralis.User.current();
    if (currentUser) {
      document.getElementById("swap_button").disabled = false;
    }
}

async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      user = await Moralis.authenticate({ signingMessage: "Welcome to DEX!" })
      console.log(user)
      console.log(user.get('ethAddress'))
   } catch(error) {
     console.error(error)
   }
  }
}

function openModal() {
    currentSelectSide = side;
    document.getElementById("token_modal").style.display = "block";
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;