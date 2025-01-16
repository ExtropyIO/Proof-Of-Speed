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




## Resources:
- [Dojo](https://github.com/dojoengine/dojo)
- [Madara](https://github.com/keep-starknet-strange/madara) 
- [Awesome dojo repo](https://github.com/dojoengine/awesome-dojo?tab=readme-ov-file) 
 
 


