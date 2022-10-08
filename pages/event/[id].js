import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import { BigNumber, ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import erc20abi from "./ERC20ABI.json";
import { useAccount } from "wagmi";
import connectContract from "../../utils/connectContract";
import formatTimestamp from "../../utils/formatTimestamp";
import Alert from "../../components/Alert";
import {
  EmojiHappyIcon,
  TicketIcon,
  UsersIcon,
  LinkIcon,
} from "@heroicons/react/outline";


function Event({ event }) {
  const { data: account } = useAccount();

  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime());

  /*function Approve() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ERC20contract = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1";
    const PokerContract = "0xedc4612a64965d756da358ef507d5449526a2e3b";
    const erc20 = new ethers.Contract(ERC20contract, erc20abi, signer);
    erc20.approve(PokerContract, BigInt(100000000000000000000))
  }; */


  

  function checkIfAlreadyRSVPed() {
    if (account) {
      for (let i = 0; i < event.rsvps.length; i++) {
        const thisAccount = account.address.toLowerCase();
        if (event.rsvps[i].attendee.id.toLowerCase() == thisAccount) {
          return true;
        }
      }
    }
    return false;
  }

 /* const ApproveERC20 = async (e) => { 
    const provider =  new ethers.providers.Web3Provider(window.ethereum);
    const ERC20contract = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1";
    const PokerContract = "0x05f9af66e1e1cfb1494c7e339bc787c028233f26";
    const erc20 = new ethers.Contract(ERC20contract, erc20abi, provider);
    const owner = account.address.toLowerCase();
    const allowance = await erc20.allowance(owner, PokerContract);
    const btn = document.getElementById('inscription');
  }

  function CheckIfAlreadyApproved() {
    if (allowance == 0) {
      btn.textContent = 'Aprueba tus ERC20';
      return false;
    } else {
      btn.textContent = 'Inscríbete!';
      return true;
    }
    }; */
  

    

  const newRSVP = async () => {
    try {
      const rsvpContract = connectContract();

      if (rsvpContract) {
        const _discordId = document.getElementById('discordId').value;
      
          if (_discordId.length == 0){
            alert("Recuerda incluir tu usuario de Discord!")
            process.exit();
        }
        const provider =  new ethers.providers.Web3Provider(window.ethereum);
        const ERC20contract = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1";
        const PokerContract = "0x05f9af66e1e1cfb1494c7e339bc787c028233f26";
        const erc20 = new ethers.Contract(ERC20contract, erc20abi, provider);
        const owner = account.address.toLowerCase();
        const allowance = await erc20.allowance(owner, PokerContract);
        const approvalamount = BigInt(10000000000000000000)

        if (allowance < approvalamount) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const ERC20contract = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1";
          const PokerContract = "0x05f9af66e1e1cfb1494c7e339bc787c028233f26";
          const erc20 = new ethers.Contract(ERC20contract, erc20abi, signer);
          const approving = await erc20.approve(PokerContract, approvalamount)
          setLoading(true);
          console.log("Approving", approving.hash);

          await approving.wait();
        }

        const txn = await rsvpContract.createNewRSVP(event.id, _discordId, {
        gasLimit: 300000,
        });
        setLoading(true);
        console.log("Minting...", txn.hash);

        await txn.wait();
        console.log("Minted -- ", txn.hash);
        setSuccess(true);
        setLoading(false);
        setMessage("Felicidades! Te acabas de registrar!");
      } else {
        console.log("Error getting contract.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Error!");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{event.name} | METSO Fun</title>
        <meta name="description" content={event.name} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="relative py-12">
        {loading && (
          <Alert
            alertType={"Cargando"}
            alertBody={"Por favor espera"}
            triggerAlert={true}
            color={"white"}
          />
        )}
        {success && (
          <Alert
            alertType={"success"}
            alertBody={message}
            triggerAlert={true}
            color={"palegreen"}
          />
        )}
        {success === false && (
          <Alert
            alertType={"failed"}
            alertBody={message}
            triggerAlert={true}
            color={"palevioletred"}
          />
        )}
        <h6 className="mb-2">{formatTimestamp(event.eventTimestamp)}</h6>
        <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-6 lg:mb-12">
          {event.name}
        </h1>
        <div className="flex flex-wrap-reverse lg:flex-nowrap">
          <div className="w-full pr-0 lg:pr-24 xl:pr-32">
            <div className="mb-8 w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
              {event.imageURL && (
                <Image src={event.imageURL} alt="event image" layout="fill" />
              )}
            </div>
            <p>{event.description}</p>
          </div>
          <div className="max-w-xs w-full flex flex-col gap-4 mb-6 lg:mb-0">
            {event.eventTimestamp > currentTimestamp ? (
              account ? (
                checkIfAlreadyRSVPed() ? (
                  <>
                    <span className="w-full text-center px-6 py-3 text-base font-medium rounded-full text-black-800 bg-red-200">
                      Te has inscrito! 🙌
                    </span>
                  </>
                ) : (
                  <>
                  <button type="button" id="inscription"  className="w-full items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-black-700 bg-red-100 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={newRSVP}>
                  Inscríbete por {ethers.utils.formatEther(event.deposit)} USDC
                    </button>
                    <div id="centerit">
                    <form>
                    <label>
                    <input type="text" id="discordId" placeholder="Tu usuario de Discord"/>
                    </label>
                    </form>
                    </div>
                  </>
                )
              ) : (
                <ConnectButton />
              )
            ) : (
              <span className="w-full text-center px-6 py-3 text-base font-medium rounded-full border-2 border-gray-200">
                Este evento está en el pasado
              </span>
            )}


            <br></br><div className="flex item-center">
              <UsersIcon className="w-6 mr-2" />
              <span className="truncate">
                {event.totalRSVPs} Inscripciones
              </span>
            </div>
            <div className="flex items-center">
              <EmojiHappyIcon className="w-10 mr-2" />
              <span className="truncate">
                Creado por{" "}
                <a
                  className="text-indigo-800 truncate hover:underline"
                  href={`${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}address/${event.eventOwner}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {event.eventOwner}
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Event;

export async function getServerSideProps(context) {
  const { id } = context.params;
  console.log(id);

  const { data } = await client.query({
    query: gql`
      query Event($id: String!) {
        event(id: $id) {
          id
          eventID
          name
          description
          link
          eventOwner
          eventTimestamp
          maxCapacity
          deposit
          totalRSVPs
          totalConfirmedAttendees
          imageURL
          rsvps {
            id
            attendee {
              id
            }
          }
        }
      }
    `,
    variables: {
      id: id,
    },
  });

  return {
    props: {
      event: data.event,
    },
  };
}

export const config = {
  unstable_excludeFiles: ["public/**/*"],
};

