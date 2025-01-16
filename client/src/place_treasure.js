import { Account, Contract, RpcProvider } from "starknet";

// from Katana:
// | Account address |  0x13d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7
// | Private key     |  0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b
// | Public key      |  0x4c339f18b9d1b95b64a6d378abd1480b2e0d5d5bd33cd0828cbce4d65c27284

async function placeTreasure() {
  const provider = new RpcProvider({ nodeUrl: `http://0.0.0.0:5050` });

  const privateKey0 =
    "0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b";
  const account0Address =
    "0x13d9ee239f33fea4f8785b9e3870ade909e20a9599ae7cd62c1c292b73af1b7";

  const account0 = new Account(provider, account0Address, privateKey0);

  const testAddress =
    "0x02d2a4804f83c34227314dba41d5c2f8a546a500d34e30bb5078fd36b5af2d77";

  const { abi: testAbi } = await provider.getClassAt(
    " 0x0525177c8afe8680d7ad1da30ca183e482cfcd6404c1e09d83fd3fa2994fd4b8"
  );

  if (testAbi === undefined) {
    throw new Error("no abi.");
  }

  const myTestContract = new Contract(testAbi, testAddress, provider);

  myTestContract.connect(account0);

  const t = await myTestContract.place_treasure(1, 1);

  await provider.waitForTransaction(t.transaction_hash);
}

placeTreasure();
