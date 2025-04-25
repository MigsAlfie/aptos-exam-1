import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey} from "@aptos-labs/ts-sdk";

async function main() {

  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  const PRIVATE_KEY = new Ed25519PrivateKey("0x78d49d2bd7ffe67fb748141fd21fb678c31d043467c38e873d6f2b2f55246249");
  
  const MY_ACCOUNT = Account.fromPrivateKey({
    privateKey: PRIVATE_KEY,
  });

  const myBalance = await aptos.getAccountAPTAmount({
    accountAddress: MY_ACCOUNT.accountAddress,
  });

  const transaction = await aptos.transaction.build.simple({
    sender: MY_ACCOUNT.accountAddress,
    data: {
      function:
        "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
      functionArguments: [
        "0x539f880b3da2bc33d98b5efbf611eb76b6a980b0fdb15badb537767e0767d6e3",
        "Miguel Alfonso Curaraton",
        "MigsAlfie",
        "curaratonmiguel@gmail.com",
        "Alfiekinnies",
      ],
    },
  });

  const senderAuthenticator = aptos.transaction.sign({
    signer: MY_ACCOUNT,
    transaction,
  });

  const pendingTransaction = await aptos.transaction.submit.simple({
    transaction,
    senderAuthenticator,
  });

  const txnResult = await aptos.waitForTransaction({
    transactionHash: pendingTransaction.hash,
  });

// optional: so we can see if it succeeded

  console.log(
    `Transaction completed with status: ${
      txnResult.success ? "SUCCESS" : "FAILURE"
    }`
  );
}

main().catch(console.error);

