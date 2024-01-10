//Access configuration settings on your Firebase console by navigating to 'Your apps' under project settings.

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

//Application ID and API Key can be found on your algolia account
  const client = algoliasearch('Application ID', 'API Key');
  const index = client.initIndex('your-index-name');

  async function fetchData(url) {
    try {
      const { hits } = await index.search(url);
      return hits[0];
    } catch (error) {
      console.error('Error:', error);
    }
  }


  // Event listener for the "init" message
  window.addEventListener("message", async (event) => {
    if (event.data === "init") {
      console.log("Initialized Firebase!", app);
      saveDataToFirestore(event.data.data);
    }
    else if (event.data.action === "saveData") {
       const tabs_url = event.data.data['tabs']
        for(let i=0 ; i < tabs_url.length ; i++){
           const find_url=  await fetchData(tabs_url[i]['url']);
              if (find_url !=undefined) {
                console.log("url already exists");
               
              } else if(find_url ==undefined){
               
                saveDataToFirestore(tabs_url[i]);
              }
      }
      }
  });

  

  
  async function saveDataToFirestore(tabData) {
    db.collection("chrome")
      .doc(tabData.id)
      .set(
        tabData
      )
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
  
  


