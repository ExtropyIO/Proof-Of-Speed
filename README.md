# Proof Of Speed

 
## Instruction
1. Install [Asdf](https://asdf-vm.com/guide/getting-started.html)
2. Install [Dojo](https://github.com/dojoengine/asdf-dojo)
3. Enter the client folder, install the dependencies and run:
    ```shell
    cd client
    npm i
    npm run dev
    ```
4. In a new terminal enter the contract folder and run Katana tool (built in Dojo)
    ```shell
    cd contract
    katana --dev --dev.no-fee --http.cors_origins '*'
    ```
5. In a new terminal enter the contract folder again and run
    ```shell
    cd contract
    sozo build && sozo migrate
    ```
6. In a new terminal in the Proof-Of-Speed root folder run
    ```shell
    sh torii persistent "dojo_starter-Moved dojo_starter-PlayerSpawned dojo_starter-StartGame"
    ```
7. Launch the browser and navigate to `http://localhost:5173/`
8. Press the + button to start the game and then the arrows to move the player.
