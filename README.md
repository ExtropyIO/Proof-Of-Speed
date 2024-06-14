# starkhack
## PROJECT IDEA OVERVIEW
A 2d solo game (speedrunning) that allows to make a zk proof after each game round in order to prove that the game rules were followed correctly and prevent users from cheating.
GUI ideas:
  - [Super Mario](https://venturebeat.com/wp-content/uploads/2015/06/Super-Mario-Maker-E3-2015-06.jpeg?w=400) 
  - [Geometry Dash](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource122/v4/9f/39/93/9f39931c-0135-c55d-a6d4-a57a10b406b6/aa06d1dc-4ef3-4d8a-9361-d1e4a0e0349d_05.png/643x0w.jpg) 

## PROJECT GOALS
- Prevent gamers from cheating in speedrunning game. We want avoid:
  - **Use of SaveStates in emulators** -> "save state" and "load state" functionalities in games played within emulators allow players to retry arbitrary game sections in order to achieve a perfect result. It's like doing [Save Scumming](https://blog.acer.com/en/discussion/911/what-is-save-scumming#:~:text=With%20save%20scumming%2C%20players%20can,from%20the%20overall%20gaming%20experience.) even if the game doesn't allow it. Prove that no emulators were used during the game round or that such functionalities weren't used. More [here](https://www.youtube.com/watch?v=BNP7ykDE5Pc&ab_channel=SilokHawk) and [here](https://www.youtube.com/watch?v=tQX8S5hVoVM&ab_channel=Mr.Sujano).
  - **Editing game source code** -> prove that the game roung was played using official game releases
  - **Frame rate manipulation** -> prove that the game round was played entirely at for example 60 fps
  - **Game time stretching** -> prove that game time wasn't manipulated
  - **Using macros and scripts** -> prove that the game round was played only using human inputs from a keyboard and not by a bot/script.
  - **Taking advantage of game glitches**
  - **Leaderboard manipulation**
  - **Manipulating files containing game saved states**
 
## RESOURCES:
- [Hackaton page](https://ethglobal.com/events/starkhack )
- [Madara](https://github.com/keep-starknet-strange/madara) 
- [Extropy/ArbSim](https://github.com/ExtropyIO/ArbSim) 
- [Cartridge Controller](https://github.com/cartridge-gg/controller) (for accessing extra 2,500$ prize in Cartridge hackaton prize)
- Dojo:
  - [Extropy Dojo article](https://extropy-io.medium.com/tutorial-writing-a-game-using-cairo-and-dojo-e6320ebc5a93)
  - [Dojo Slot docs](https://book.dojoengine.org/toolchain/slot) 
  - [Awesome dojo repo](https://github.com/dojoengine/awesome-dojo?tab=readme-ov-file) (contains list of games)
- Bevy Engine:
  - [bevy 0.11 playlist](https://www.youtube.com/playlist?list=PLT_D88-MTFOMLnBeTJJn9LhDON_fvHi6u)
  - [bevy 0.12 playlist](https://www.youtube.com/playlist?list=PL2wAo2qwCxGDp9fzBOTy_kpUTSwM1iWWd)
  - [2 hours video: create a game in bevy from 0](https://www.youtube.com/watch?v=fFm1IxuPQxA&ab_channel=UtahRust)
  - [List of games made with Bevy](https://bevydepy.com/popular?bevy=0.10&page=7)
  - [Super Mario in Bevy](https://github.com/alexandrearcil/mario-rust)
 

 ## PROJECT TECHNICAL ARCHITECTURE:
...
