import { ChartIcon } from "../../assets/icons/ChartIcon";
import { WalletIcon } from "../../assets/icons/WalletIcon";
import web3Image from "../../assets/oci4.png";
import telegram from "../../assets/telegram.png";
import logo from "../../assets/logo2.png";
import email from "../../assets/email.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";
import banner from "../../assets/bannerpng.png";
import { TwitterIcon } from "../../assets/icons/TwitterIcon";
import { TelegramIcon } from "../../assets/icons/TelegramIcon";
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import * as config from "../config";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { ethers, BrowserProvider, Contract, formatUnits } from "ethers";
import Loader from "./Loader";

const tabList = ["Pool1", "Pool2", "Pool3", "Pool4"];

const Home = () => {
  const [tab, setTab] = useState("Pool1");
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState("");
  const [contractData, setData] = useState("0");
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [poolState, setPoolState] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab");
  console.log("This is the tab param", { tabParam });
  const [inputVal, setinputVal] = useState(0);
  const [inputValUnstake, setinputValUnstake] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(30);
  //const [number_Of_Stakers, setNumberOfStakers] = useState(0);
  const [dataOne, setDataOne] = useState(null);
  //const [lockperiod, setUsersDays] = useState(0);
  //const [daysleft, setDaysLeft] = useState(0);

  const [ocicatPrice, setOcicatPrice] = useState(0);
  const [wbnbPrice, setWBNBPrice] = useState(0);
  const [wikicatPrice, setWikicatPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/0x37Fe635D1e25B2F7276C1B9dBBcc7b087f80C050,0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c,0x6Ec90334d89dBdc89E08A133271be3d104128Edb"
        );
        const result = await response.json();
        //setData(result);
        let ocicat_price =
          result.data.attributes.token_prices[
            "0x37fe635d1e25b2f7276c1b9dbbcc7b087f80c050"
          ];
        let wbnb_price =
          result.data.attributes.token_prices[
            "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
          ];
        let wikicat_price =
          result.data.attributes.token_prices[
            "0x6ec90334d89dbdc89e08a133271be3d104128edb"
          ];

        setOcicatPrice(ocicat_price);
        setWikicatPrice(wikicat_price);
        setWBNBPrice(wbnb_price);

        console.log("fetch api", { wikicat_price });
        globalPrice();
        console.log({ result });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const globalPrice = async () => {
    console.log("global data: ");
    // ====================================POOL ONE
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const POOL1Contract = new Contract(
      contractData.POOLOneAddress,
      contractData.POOLOneABI,
      signer
    );
    let totalStakedPoolOne = await POOL1Contract.totalStakedTokens();
    totalStakedPoolOne = await ethers.formatEther(
      totalStakedPoolOne.toString()
    );
    //console.log(typeof(totalStaked))
    totalStakedPoolOne = parseInt(totalStakedPoolOne).toFixed(2);

    // ====================================POOL TWO
    const POOL2Contract = new Contract(
      contractData.POOLTwoAddress,
      contractData.POOLTwoABI,
      signer
    );

    const POOLTWOLPContract = new Contract(
      contractData.POOLTwoLPTOKEN,
      contractData.POOLTwoLPABI,
      signer
    );

    let poolTwoLPReserves = await POOLTWOLPContract.getReserves();
    let poolTwoLPOcicatReserve = poolTwoLPReserves[0]; //OCICAT
    poolTwoLPOcicatReserve = await ethers.formatEther(
      poolTwoLPOcicatReserve.toString()
    );
    console.log({ poolTwoLPOcicatReserve });

    let poolTwoLPWBNBReserve = poolTwoLPReserves[1]; //WBNB
    poolTwoLPWBNBReserve = await ethers.formatEther(
      poolTwoLPWBNBReserve.toString()
    );
    console.log({ poolTwoLPWBNBReserve });

    let poolTwoLPSupply = await POOLTWOLPContract.totalSupply();
    poolTwoLPSupply = await ethers.formatEther(poolTwoLPSupply.toString());
    console.log({ poolTwoLPSupply });

    let amount_of_token_ocicat_in_one_lp =
      poolTwoLPOcicatReserve / poolTwoLPSupply;
    let amount_of_token_wbnb_in_one_lp = poolTwoLPWBNBReserve / poolTwoLPSupply;
    console.log({ ocicatPrice, wbnbPrice });
    let ocicat_price = parseFloat(ocicatPrice);
    let wbnb_price = parseFloat(wbnbPrice);

    let value_of_one_lp =
      ocicat_price * amount_of_token_ocicat_in_one_lp +
      wbnb_price * amount_of_token_wbnb_in_one_lp;
    let tokenPricePoolTwo = value_of_one_lp.toFixed(8);

    let totalStakedPoolTwo = await POOL2Contract.totalStakedTokens();
    totalStakedPoolTwo = await ethers.formatEther(
      totalStakedPoolTwo.toString()
    );
    //console.log(typeof(totalStaked))
    totalStakedPoolTwo = parseInt(totalStakedPoolTwo).toFixed(2);
    // ====================================

    //=================================Pool Three
    const POOL3Contract = new Contract(
      contractData.POOLThreeAddress,
      contractData.POOLThreeABI,
      signer
    );

    let totalStakedPoolThree = await POOL3Contract.totalStakedTokens();
    totalStakedPoolThree = await ethers.formatEther(
      totalStakedPoolThree.toString()
    );
    //console.log(typeof(totalStaked))
    totalStakedPoolThree = parseInt(totalStakedPoolThree).toFixed(2);
    let tvlPoolThree = totalStakedPoolThree * wikicatPrice;
    console.log({ tvlPoolThree, totalStakedPoolThree, wikicatPrice });
  };

  const poolOneData = async () => {
    console.log("here is our console pool one");

    let totalStaked = 0;
    let numberOfStakers = 0;
    let allowance = 0;
    let userStakedBal = 0;
    let daysLeft = 0;
    let userDays = 0;
    let userDaysMATHS = 0;
    let availableBalance = 0;
    let rewards = 0;
    let rewardsRate = 0 + "%";
    let ocicatbalance = 0;
    let depositedTokens = 0;
    let daysRate = 0;
    let stakeTime = 0;
    let totalReward = 0;
    let tokenPrice = 0;

    //let g = contractData;
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const POOLContract = new Contract(
      contractData.POOLOneAddress,
      contractData.POOLOneABI,
      signer
    );

    const OCICATContract = new Contract(
      contractData.OCICAT_TOKEN,
      contractData.OCICAT_ABI,
      signer
    );

    const POOLONELPContract = new Contract(
      contractData.POOLOneLPTOKEN,
      contractData.POOLOneLPABI,
      signer
    );

    totalStaked = await POOLContract.totalStakedTokens();
    totalStaked = await ethers.formatEther(totalStaked.toString());
    //console.log(typeof(totalStaked))
    totalStaked = parseInt(totalStaked).toFixed(2);
    //console.log({ totalStaked });

    totalReward = await POOLContract.totalClaimedRewards();
    totalReward = await ethers.formatEther(totalReward.toString());
    //console.log(typeof(totalStaked))
    totalReward = parseInt(totalReward).toFixed(2);
    //console.log({ ethers });
    numberOfStakers = await POOLContract.getNumberOfStakers();

    //numberOfStakers = await ethers.formatEther(numberOfStakers.toString());
    //console.log({ numberOfStakers });
    numberOfStakers = parseInt(numberOfStakers);
    console.log({ numberOfStakers });

    //console.log({ address });
    daysRate = await POOLContract.daysRates(numberOfDays * 60 * 60 * 24);
    daysRate = parseInt(daysRate).toFixed(2);
    daysRate = daysRate / 100;
    //let amount = await ethers.parseEther(inputVal);
    console.log({ daysRate });
    console.log({ numberOfDays });

    try {
      const response = await fetch(
        "https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/0x37Fe635D1e25B2F7276C1B9dBBcc7b087f80C050"
      );
      const result = await response.json();
      //setData(result);
      tokenPrice =
        result.data.attributes.token_prices[
          "0x37fe635d1e25b2f7276c1b9dbbcc7b087f80c050"
        ];
      tokenPrice = parseFloat(tokenPrice);
      tokenPrice = tokenPrice.toFixed(14);
      console.log({ tokenPrice });
      //console.log({result})
    } catch (error) {
      tokenPrice = 0;
      console.error("Error fetching data:", error);
    }

    //let price = https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/0x37Fe635D1e25B2F7276C1B9dBBcc7b087f80C050;

    if (address != undefined) {
      rewards = await POOLContract.getUnclaimedDivs(address);
      rewards = await ethers.formatEther(rewards.toString());
      console.log({ rewards });
      rewards = (rewards * 1).toFixed(4);

      userDays = await POOLContract.depositedDays(address);
      userDays = parseInt(userDays);
      userDaysMATHS = parseInt(userDays);
      userDays = (userDays / 86400).toFixed(2);
      console.log({ userDays });

      stakeTime = await POOLContract.stakingTime(address);
      stakeTime = parseInt(stakeTime);

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      let timegap = (currentTimeInSeconds - stakeTime) / 86400;
      let gapindays = userDaysMATHS - timegap;
      daysLeft = (gapindays / 86400).toFixed(2);
      console.log({ gapindays, timegap, currentTimeInSeconds, stakeTime });

      // daysRate = await POOLContract.daysRates(numberOfDays*60*60*24);
      // daysRate = parseInt(daysRate).toFixed(2);
      // daysRate = daysRate / 100;
      // //let amount = await ethers.parseEther(inputVal);
      // console.log({ daysRate });
      // console.log({ numberOfDays });

      depositedTokens = await POOLContract.depositedTokens(address);
      depositedTokens = await ethers.formatEther(depositedTokens.toString());

      ocicatbalance = await OCICATContract.balanceOf(address);
      ocicatbalance = await ethers.formatEther(ocicatbalance.toString());

      let poolOneLP = await POOLONELPContract.balanceOf(address);
      availableBalance = await ethers.formatEther(poolOneLP.toString());

      allowance = await POOLONELPContract.allowance(
        address,
        contractData.POOLOneAddress
      );
      allowance = await ethers.formatEther(allowance.toString());
      console.log({ allowance });
    }

    return {
      totalStaked,
      numberOfStakers,
      userStakedBal,
      daysLeft,
      userDays,
      ocicatbalance,
      depositedTokens,
      availableBalance,
      daysRate,
      rewards,
      rewardsRate,
      allowance,
      totalReward,
      tokenPrice,
    };
  };

  const poolTwoData = async () => {
    console.log("here is our console Pool two");

    let totalStaked = 0;
    let numberOfStakers = 0;
    let allowance = 0;
    let userStakedBal = 0;
    let daysLeft = 0;
    let userDays = 0;
    let userDaysMATHS = 0;
    let availableBalance = 0;
    let rewards = 0;
    let rewardsRate = 0 + "%";
    let ocicatbalance = 0;
    let depositedTokens = 0;
    let daysRate = 0;
    let stakeTime = 0;
    let totalReward = 0;
    let tokenPrice = 0;

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const POOLContract = new Contract(
      contractData.POOLTwoAddress,
      contractData.POOLTwoABI,
      signer
    );
    //   POOLTwoAddress,
    // POOLTwoABI,
    const OCICATContract = new Contract(
      contractData.OCICAT_TOKEN,
      contractData.OCICAT_ABI,
      signer
    );

    const POOLTWOLPContract = new Contract(
      contractData.POOLTwoLPTOKEN,
      contractData.POOLTwoLPABI,
      signer
    );

    totalStaked = await POOLContract.totalStakedTokens();
    totalStaked = await ethers.formatEther(totalStaked.toString());
    //console.log(typeof(totalStaked))
    totalStaked = parseInt(totalStaked).toFixed(2);
    //console.log({ totalStaked });

    totalReward = await POOLContract.totalClaimedRewards();
    totalReward = await ethers.formatEther(totalReward.toString());
    //console.log(typeof(totalStaked))
    totalReward = parseInt(totalReward).toFixed(2);

    //console.log({ ethers });
    numberOfStakers = await POOLContract.getNumberOfStakers();

    //numberOfStakers = await ethers.formatEther(numberOfStakers.toString());
    //console.log({ numberOfStakers });
    numberOfStakers = parseInt(numberOfStakers);
    //console.log({ numberOfStakers });

    //console.log({ address });
    daysRate = await POOLContract.daysRates(numberOfDays * 60 * 60 * 24);
    daysRate = parseInt(daysRate).toFixed(2);
    daysRate = daysRate / 100;
    //let amount = await ethers.parseEther(inputVal);
    console.log({ daysRate });
    console.log({ numberOfDays });

    //Token price here
    let poolTwoLPReserves = await POOLTWOLPContract.getReserves();
    let poolTwoLPOcicatReserve = poolTwoLPReserves[0]; //OCICAT
    poolTwoLPOcicatReserve = await ethers.formatEther(
      poolTwoLPOcicatReserve.toString()
    );
    console.log({ poolTwoLPOcicatReserve });

    let poolTwoLPWBNBReserve = poolTwoLPReserves[1]; //WBNB
    poolTwoLPWBNBReserve = await ethers.formatEther(
      poolTwoLPWBNBReserve.toString()
    );
    console.log({ poolTwoLPWBNBReserve });

    let poolTwoLPSupply = await POOLTWOLPContract.totalSupply();
    poolTwoLPSupply = await ethers.formatEther(poolTwoLPSupply.toString());
    console.log({ poolTwoLPSupply });

    let amount_of_token_ocicat_in_one_lp =
      poolTwoLPOcicatReserve / poolTwoLPSupply;
    let amount_of_token_wbnb_in_one_lp = poolTwoLPWBNBReserve / poolTwoLPSupply;
    console.log({ ocicatPrice, wbnbPrice });
    let ocicat_price = parseFloat(ocicatPrice);
    let wbnb_price = parseFloat(wbnbPrice);

    let value_of_one_lp =
      ocicat_price * amount_of_token_ocicat_in_one_lp +
      wbnb_price * amount_of_token_wbnb_in_one_lp;
    tokenPrice = value_of_one_lp.toFixed(8);

    console.log({ value_of_one_lp });

    if (address != undefined) {
      rewards = await POOLContract.getUnclaimedDivs(address);
      rewards = await ethers.formatEther(rewards.toString());
      console.log({ rewards });
      rewards = (rewards * 1).toFixed(4);

      userDays = await POOLContract.depositedDays(address);
      userDays = parseInt(userDays);
      userDaysMATHS = parseInt(userDays);
      userDays = (userDays / 86400).toFixed(2);
      console.log({ userDays });

      stakeTime = await POOLContract.stakingTime(address);
      stakeTime = parseInt(stakeTime);

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      let timegap = (currentTimeInSeconds - stakeTime) / 86400;
      let gapindays = userDaysMATHS - timegap;
      daysLeft = (gapindays / 86400).toFixed(2);
      console.log({ gapindays, timegap, currentTimeInSeconds, stakeTime });

      // daysRate = await POOLContract.daysRates(numberOfDays);
      // daysRate = parseInt(daysRate).toFixed(2);
      // daysRate = daysRate / 100;
      // //let amount = await ethers.parseEther(inputVal);
      // console.log({ daysRate });

      depositedTokens = await POOLContract.depositedTokens(address);
      depositedTokens = await ethers.formatEther(depositedTokens.toString());

      ocicatbalance = await OCICATContract.balanceOf(address);
      ocicatbalance = await ethers.formatEther(ocicatbalance.toString());

      let poolTwoLP = await POOLTWOLPContract.balanceOf(address);
      availableBalance = await ethers.formatEther(poolTwoLP.toString());

      allowance = await POOLTWOLPContract.allowance(
        address,
        contractData.POOLTwoAddress
      );
      allowance = await ethers.formatEther(allowance.toString());
      console.log({ allowance });
    }

    return {
      totalStaked,
      numberOfStakers,
      userStakedBal,
      daysLeft,
      userDays,
      ocicatbalance,
      depositedTokens,
      availableBalance,
      daysRate,
      rewards,
      rewardsRate,
      allowance,
      totalReward,
      tokenPrice,
    };
  };

  const poolThreeData = async () => {
    console.log("here is our console Pool Three");

    let totalStaked = 0;
    let numberOfStakers = 0;
    let allowance = 0;
    let userStakedBal = 0;
    let daysLeft = 0;
    let userDays = 0;
    let userDaysMATHS = 0;
    let availableBalance = 0;
    let rewards = 0;
    let rewardsRate = 0 + "%";
    let ocicatbalance = 0;
    let depositedTokens = 0;
    let daysRate = 0;
    let stakeTime = 0;
    let totalReward = 0;
    let tokenPrice = 0;
    let totalRewardDollar = 0;
    let totalStakeDollar = 0;

    //console.log({wikicatPrice})
    let wikicat_price = parseFloat(wikicatPrice);
    //console.log({wikicat_price})
    tokenPrice = wikicat_price.toFixed(14);
    //console.log(typeof tokenPrice)
    //tokenPrice = wikicat_price.toFixed(14);
    console.log("converted", { tokenPrice });

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const POOLContract = new Contract(
      contractData.POOLThreeAddress,
      contractData.POOLThreeABI,
      signer
    );
    //   POOLTwoAddress,
    // POOLTwoABI,
    const OCICATContract = new Contract(
      contractData.OCICAT_TOKEN,
      contractData.OCICAT_ABI,
      signer
    );

    const POOLTHREELPContract = new Contract(
      contractData.POOLThreeLPTOKEN,
      contractData.POOLThreeLPABI,
      signer
    );

    totalStaked = await POOLContract.totalStakedTokens();
    totalStaked = await ethers.formatEther(totalStaked.toString());
    //console.log(typeof(totalStaked))
    totalStaked = parseInt(totalStaked).toFixed(2);

    //console.log({ totalStaked });
    //console.log({ ethers });
    totalReward = await POOLContract.totalClaimedRewards();
    totalReward = await ethers.formatEther(totalReward.toString());
    //console.log(typeof(totalStaked))
    totalReward = parseInt(totalReward).toFixed(2);

    // totalRewardDollar = totalReward * tokenPrice;
    // totalRewardDollar = totalRewardDollar.toFixed(5);
    // console.log({totalRewardDollar})

    numberOfStakers = await POOLContract.getNumberOfStakers();

    //numberOfStakers = await ethers.formatEther(numberOfStakers.toString());
    //console.log({ numberOfStakers });
    numberOfStakers = parseInt(numberOfStakers);
    //console.log({ numberOfStakers });

    //console.log({ address });

    daysRate = await POOLContract.daysRates(numberOfDays * 60 * 60 * 24);
    daysRate = parseInt(daysRate).toFixed(2);
    daysRate = daysRate / 100;
    //let amount = await ethers.parseEther(inputVal);
    console.log({ daysRate });
    console.log({ numberOfDays });

    if (address != undefined) {
      rewards = await POOLContract.getUnclaimedDivs(address);
      rewards = await ethers.formatEther(rewards.toString());
      console.log({ rewards });
      rewards = (rewards * 1).toFixed(4);

      userDays = await POOLContract.depositedDays(address);
      userDays = parseInt(userDays);
      userDaysMATHS = parseInt(userDays);
      userDays = (userDays / 86400).toFixed(2);
      console.log({ userDays });

      stakeTime = await POOLContract.stakingTime(address);
      stakeTime = parseInt(stakeTime);

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      let timegap = (currentTimeInSeconds - stakeTime) / 86400;
      let gapindays = userDaysMATHS - timegap;
      daysLeft = (gapindays / 86400).toFixed(2);
      console.log({ gapindays, timegap, currentTimeInSeconds, stakeTime });

      // daysRate = await POOLContract.daysRates(numberOfDays);
      // daysRate = parseInt(daysRate).toFixed(2);
      // daysRate = daysRate / 100;
      // //let amount = await ethers.parseEther(inputVal);
      // console.log({ daysRate });

      depositedTokens = await POOLContract.depositedTokens(address);
      depositedTokens = await ethers.formatEther(depositedTokens.toString());

      ocicatbalance = await OCICATContract.balanceOf(address);
      ocicatbalance = await ethers.formatEther(ocicatbalance.toString());

      let poolThreeLP = await POOLTHREELPContract.balanceOf(address);
      availableBalance = await ethers.formatEther(poolThreeLP.toString());

      allowance = await POOLTHREELPContract.allowance(
        address,
        contractData.POOLThreeAddress
      );
      allowance = await ethers.formatEther(allowance.toString());
      console.log({ allowance });
    }

    return {
      totalStaked,
      numberOfStakers,
      userStakedBal,
      daysLeft,
      userDays,
      ocicatbalance,
      depositedTokens,
      availableBalance,
      daysRate,
      rewards,
      rewardsRate,
      allowance,
      totalReward,
      tokenPrice,
      totalRewardDollar,
      totalStakeDollar,
    };
  };

  const poolFourData = async () => {
    console.log("here is our console Pool three");

    let totalStaked = 0;
    let numberOfStakers = 0;
    let allowance = 0;
    let userStakedBal = 0;
    let daysLeft = 0;
    let userDays = 0;
    let userDaysMATHS = 0;
    let availableBalance = 0;
    let rewards = 0;
    let rewardsRate = 0 + "%";
    let ocicatbalance = 0;
    let depositedTokens = 0;
    let daysRate = 0;
    let stakeTime = 0;
    let totalReward = 0;
    let totalRewardDollar = 0;
    let totalStakeDollar = 0;

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const POOLContract = new Contract(
      contractData.POOLFourAddress,
      contractData.POOLFourABI,
      signer
    );
    //   POOLTwoAddress,
    // POOLTwoABI,
    const OCICATContract = new Contract(
      contractData.OCICAT_TOKEN,
      contractData.OCICAT_ABI,
      signer
    );

    const POOLFOURLPContract = new Contract(
      contractData.POOLFourLPTOKEN,
      contractData.POOLFourLPABI,
      signer
    );

    totalStaked = await POOLContract.totalStakedTokens();
    totalStaked = await ethers.formatEther(totalStaked.toString());
    //console.log(typeof(totalStaked))
    totalStaked = parseInt(totalStaked).toFixed(2);

    totalReward = await POOLContract.totalClaimedRewards();
    totalReward = await ethers.formatEther(totalReward.toString());
    //console.log(typeof(totalStaked))
    totalReward = parseInt(totalReward).toFixed(2);

    //console.log({ totalStaked });

    //console.log({ ethers });
    numberOfStakers = await POOLContract.getNumberOfStakers();

    //numberOfStakers = await ethers.formatEther(numberOfStakers.toString());
    //console.log({ numberOfStakers });
    numberOfStakers = parseInt(numberOfStakers);
    console.log({ numberOfStakers });

    console.log({ address });

    daysRate = await POOLContract.daysRates(numberOfDays * 60 * 60 * 24);
    daysRate = parseInt(daysRate).toFixed(2);
    daysRate = daysRate / 100;
    //let amount = await ethers.parseEther(inputVal);
    console.log({ daysRate });
    console.log({ numberOfDays });

    if (address != undefined) {
      rewards = await POOLContract.getUnclaimedDivs(address);
      rewards = await ethers.formatEther(rewards.toString());
      console.log({ rewards });
      rewards = (rewards * 1).toFixed(4);

      userDays = await POOLContract.depositedDays(address);
      userDays = parseInt(userDays);
      userDaysMATHS = parseInt(userDays);
      userDays = (userDays / 86400).toFixed(2);
      console.log({ userDays });

      stakeTime = await POOLContract.stakingTime(address);
      stakeTime = parseInt(stakeTime);

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      let timegap = (currentTimeInSeconds - stakeTime) / 86400;
      let gapindays = userDaysMATHS - timegap;
      daysLeft = (gapindays / 86400).toFixed(2);
      console.log({ gapindays, timegap, currentTimeInSeconds, stakeTime });

      // daysRate = await POOLContract.daysRates(numberOfDays);
      // daysRate = parseInt(daysRate).toFixed(2);
      // daysRate = daysRate / 100;
      // //let amount = await ethers.parseEther(inputVal);
      // console.log({ daysRate });

      depositedTokens = await POOLContract.depositedTokens(address);
      depositedTokens = await ethers.formatEther(depositedTokens.toString());

      ocicatbalance = await OCICATContract.balanceOf(address);
      ocicatbalance = await ethers.formatEther(ocicatbalance.toString());

      let poolFourLP = await POOLFOURLPContract.balanceOf(address);
      availableBalance = await ethers.formatEther(poolFourLP.toString());

      allowance = await POOLFOURLPContract.allowance(
        address,
        contractData.POOLFourAddress
      );
      allowance = await ethers.formatEther(allowance.toString());
      console.log({ allowance });
    }

    return {
      totalStaked,
      numberOfStakers,
      userStakedBal,
      daysLeft,
      userDays,
      ocicatbalance,
      depositedTokens,
      availableBalance,
      daysRate,
      rewards,
      rewardsRate,
      allowance,
      totalReward,
      totalRewardDollar,
      totalStakeDollar,
    };
  };

  const approvePoolOne = async () => {
    console.log(inputVal);
    console.log("Hey man Approve 1 !!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const POOLContract = new Contract(
      contractData.POOLOneAddress,
      contractData.POOLOneABI,
      signer
    );

    console.log("approve", { POOLContract });
    const POOLONELPContract = new Contract(
      contractData.POOLOneLPTOKEN,
      contractData.POOLOneLPABI,
      signer
    );

    //const signature = await signer?.signMessage('Hello Web3Modal Ethers');
    let amount = await ethers.parseEther(inputVal);
    console.log({ amount });
    try {
      const transaction = await POOLONELPContract.approve(POOLContract, amount);
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";
        console.log(status);

        toast.success("Transaction Successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const approvePoolTwo = async () => {
    console.log(inputVal);
    console.log("Hey man Approve Two here!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const POOLContract = new Contract(
      contractData.POOLTwoAddress,
      contractData.POOLTwoABI,
      signer
    );

    console.log("approve", { POOLContract });
    const POOLTWOLPContract = new Contract(
      contractData.POOLTwoLPTOKEN,
      contractData.POOLTwoLPABI,
      signer
    );

    //const signature = await signer?.signMessage('Hello Web3Modal Ethers');
    let amount = await ethers.parseEther(inputVal);
    console.log({ amount });
    try {
      const transaction = await POOLTWOLPContract.approve(POOLContract, amount);
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        //console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const approvePoolThree = async () => {
    console.log(inputVal);
    console.log("Hey man Approve Three here!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const POOLContract = new Contract(
      contractData.POOLThreeAddress,
      contractData.POOLThreeABI,
      signer
    );

    console.log("approve", { POOLContract });
    const POOLTHREELPContract = new Contract(
      contractData.POOLThreeLPTOKEN,
      contractData.POOLThreeLPABI,
      signer
    );

    //const signature = await signer?.signMessage('Hello Web3Modal Ethers');
    let amount = await ethers.parseEther(inputVal);
    console.log({ amount });
    try {
      const transaction = await POOLTHREELPContract.approve(
        POOLContract,
        amount
      );
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        //console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const approvePoolFour = async () => {
    console.log(inputVal);
    console.log("Hey man Approve Four here!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const POOLContract = new Contract(
      contractData.POOLFourAddress,
      contractData.POOLFourABI,
      signer
    );

    console.log("approve", { POOLContract });
    const POOLONELPContract = new Contract(
      contractData.POOLFourLPTOKEN,
      contractData.POOLFourLPABI,
      signer
    );

    //const signature = await signer?.signMessage('Hello Web3Modal Ethers');
    let amount = await ethers.parseEther(inputVal);
    console.log({ amount });
    try {
      const transaction = await POOLFOURLPContract.approve(
        POOLContract,
        amount
      );
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const stakePoolOne = async () => {
    console.log("Hey man stake 1!!!");
    console.log(numberOfDays, inputVal);
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const PoolContract = new Contract(
      contractData.POOLOneAddress,
      contractData.POOLOneABI,
      signer
    );

    const OcicatContract = new Contract(
      contractData.OCICAT_TOKEN,
      contractData.OCICAT_ABI,
      signer
    );
    //const signature = await signer?.signMessage('Hello Web3Modal Ethers');
    let amount = await ethers.parseEther(inputVal);
    console.log({ amount });

    try {
      const transaction = await PoolContract.stake(
        amount,
        numberOfDays * 60 * 60 * 24
      );
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";
        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const stakePoolTwo = async () => {
    console.log("Hey man stake 2!!!");
    console.log(numberOfDays, inputVal);
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const PoolContract = new Contract(
      contractData.POOLTwoAddress,
      contractData.POOLTwoABI,
      signer
    );

    const OcicatContract = new Contract(
      contractData.OCICAT_TOKEN,
      contractData.OCICAT_ABI,
      signer
    );
    //const signature = await signer?.signMessage('Hello Web3Modal Ethers');
    let amount = await ethers.parseEther(inputVal);
    console.log({ amount });
    try {
      const transaction = await PoolContract.stake(
        amount,
        numberOfDays * 60 * 60 * 24
      );
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const stakePoolThree = async () => {
    console.log("Hey man stake 3!!!");
    console.log(numberOfDays, inputVal);
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const PoolContract = new Contract(
      contractData.POOLThreeAddress,
      contractData.POOLThreeABI,
      signer
    );

    const OcicatContract = new Contract(
      contractData.OCICAT_TOKEN,
      contractData.OCICAT_ABI,
      signer
    );
    //const signature = await signer?.signMessage('Hello Web3Modal Ethers');
    let amount = await ethers.parseEther(inputVal);
    console.log({ amount });
    try {
      const transaction = await PoolContract.stake(
        amount,
        numberOfDays * 60 * 60 * 24
      );
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const stakePoolFour = async () => {
    console.log("Hey man stake 4!!!");
    console.log(numberOfDays, inputVal);
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const PoolContract = new Contract(
      contractData.POOLFourAddress,
      contractData.POOLFourABI,
      signer
    );

    const OcicatContract = new Contract(
      contractData.OCICAT_TOKEN,
      contractData.OCICAT_ABI,
      signer
    );
    //const signature = await signer?.signMessage('Hello Web3Modal Ethers');
    let amount = await ethers.parseEther(inputVal);
    console.log({ amount });
    try {
      const transaction = await PoolContract.stake(
        amount,
        numberOfDays * 60 * 60 * 24
      );
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const unStakePoolOne = async () => {
    console.log(inputValUnstake);
    console.log("Hey man unstake 1!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const POOLContract = new Contract(
      contractData.POOLOneAddress,
      contractData.POOLOneABI,
      signer
    );

    let amount = await ethers.parseEther(inputValUnstake);
    console.log({ amount });

    try {
      const transaction = await POOLContract.unstake(amount);
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      console.log({ error });
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const unStakePoolTwo = async () => {
    console.log(inputValUnstake);
    console.log("Hey man unstake 2!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const POOLContract = new Contract(
      contractData.POOLTwoAddress,
      contractData.POOLTwoABI,
      signer
    );

    let amount = await ethers.parseEther(inputValUnstake);
    console.log({ amount });
    try {
      const transaction = await POOLContract.unstake(amount);
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";
        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const unStakePoolThree = async () => {
    console.log(inputValUnstake);
    console.log("Hey man unstake 3!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const POOLContract = new Contract(
      contractData.POOLThreeAddress,
      contractData.POOLThreeABI,
      signer
    );

    let amount = await ethers.parseEther(inputValUnstake);
    console.log({ amount });
    try {
      const transaction = await POOLContract.unstake(amount);
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";
        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const unStakePoolFour = async () => {
    console.log(inputValUnstake);
    console.log("Hey man unstake 4!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const POOLContract = new Contract(
      contractData.POOLFourAddress,
      contractData.POOLFourABI,
      signer
    );

    let amount = await ethers.parseEther(inputValUnstake);
    console.log({ amount });
    try {
      const transaction = await POOLContract.unstake(amount);
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const claimPoolOne = async () => {
    //console.log(inputValUnstake);
    console.log("Hey man claim 1!!!");
    let status = "";

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      const POOLContract = new Contract(
        contractData.POOLOneAddress,
        contractData.POOLOneABI,
        signer
      );

      const transaction = await POOLContract.dividends();
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      console.log({ error });
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const claimPoolTwo = async () => {
    //console.log(inputValUnstake);
    console.log("Hey man claim 2!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();

    //let amount = await ethers.parseEther(inputValUnstake);
    //console.log({ amount });

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      const POOLContract = new Contract(
        contractData.POOLTwoAddress,
        contractData.POOLTwoABI,
        signer
      );

      const transaction = await POOLContract.dividends();
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      console.log({ error });
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const claimPoolThree = async () => {
    //console.log(inputValUnstake);
    console.log("Hey man claim 3!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();

    //let amount = await ethers.parseEther(inputValUnstake);
    //console.log({ amount });

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      const POOLContract = new Contract(
        contractData.POOLThreeAddress,
        contractData.POOLThreeABI,
        signer
      );

      const transaction = await POOLContract.dividends();
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      console.log({ error });
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };

  const claimPoolFour = async () => {
    //console.log(inputValUnstake);
    console.log("Hey man claim 4!!!");
    let status = "";
    //const provider = new BrowserProvider(walletProvider);
    //const signer = await provider.getSigner();

    //let amount = await ethers.parseEther(inputValUnstake);
    //console.log({ amount });

    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      const POOLContract = new Contract(
        contractData.POOLFourAddress,
        contractData.POOLFourABI,
        signer
      );

      const transaction = await POOLContract.dividends();
      let transactionHash = transaction.hash;
      console.log({ ethersProvider });
      const r = await ethersProvider.waitForTransaction(transactionHash);
      console.log(r);
      console.log(r.status);
      let receipt = r.status;
      ///****************************************************************************** shold call on the function that reloads the page again */
      //console.log(receipt);
      if (receipt == 1) {
        status = "Transaction Successful";

        toast.success("Transaction Successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //Show the success pop up message -  transaction successful
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      } else {
        status = "Transaction Failed";

        toast.error("Transaction Failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(status);
        //hide the rotating icon to indicate the transaction is processing... something like rotatingicon.hide()
        //show the failure pop message -  transaction failed
        //call the fetch data function here, not immediately the approve button is called like it is currently.
      }
    } catch (error) {
      console.log({ error });
      const errorMessage = error.shortMessage; //error.message.replace(/\s\(data=.*\)/, '');
      console.log({ errorMessage });
      toast.error(String(error.shortMessage), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    return status;
  };
  // const unStakePoolTwo = () => { };
  // const unStakePoolThree = () => { };
  // const unStakePoolFour = () => { };

  const handleUnStake = () => {
    if (tabParam === "Pool1") {
      unStakePoolOne();
    } else if (tabParam === "Pool2") {
      unStakePoolTwo();
    } else if (tabParam === "Pool3") {
      unStakePoolThree();
    } else if (tabParam === "Pool4") {
      unStakePoolFour();
    } else if (tabParam === null || tabParam === undefined) {
      unStakePoolOne();
    }
  };

  const handleClaim = () => {
    console.log("Hello God");
    if (tabParam === "Pool1") {
      claimPoolOne();
    } else if (tabParam === "Pool2") {
      claimPoolTwo();
    } else if (tabParam === "Pool3") {
      claimPoolThree();
    } else if (tabParam === "Pool4") {
      claimPoolFour();
    } else if (tabParam === null || tabParam === undefined) {
      claimPoolOne();
    }
  };

  const approveOrStake = (type) => {
    console.log("stake or approve ?: ", { type });
    if (type === "stake") {
      if (tabParam === "Pool1") {
        stakePoolOne();
      } else if (tabParam === "Pool2") {
        stakePoolTwo();
      } else if (tabParam === "Pool3") {
        stakePoolThree();
      } else if (tabParam === "Pool4") {
        stakePoolFour();
      } else if (tabParam === null || tabParam === undefined) {
        stakePoolOne();
      }
    } else if (type === "approve") {
      if (tabParam === "Pool1") {
        approvePoolOne();
      } else if (tabParam === "Pool2") {
        approvePoolTwo();
      } else if (tabParam === "Pool3") {
        approvePoolThree();
      } else if (tabParam === "Pool4") {
        approvePoolFour();
      } else if (tabParam === null || tabParam === undefined) {
        approvePoolOne();
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const allData = await config.onConnect();
      //console.log({ allData }, "alldata");
      setData(allData);
      //let d = await poolOneData();
      // stakePoolOne();
    };

    fetchData();
  }, [chainId, isConnected, numberOfDays]);

  // const handleClick = () => {
  //   getBalance();
  // };

  const fetchDataGood = async () => {
    setPoolState({
      totalStaked: 0,
      numberOfStakers: 0,
      lockperiod: 0,
      userStakedBal: 0,
      daysLeft: 0,
      availableBalance: 0,
      depositedTokens: 0,
      rewards: 0,
      daysRate: 0,
      rewardsRate: 0,
      allowance: 0,
      poolname: "",
      totalReward: 0,
      tokenPrice: 0,
    });
    let x = "";
    if (tabParam === "Pool1") {
      x = await poolOneData();
      //console.log({x})
      setPoolState({
        totalStaked: x.totalStaked,
        numberOfStakers: x.numberOfStakers,
        lockperiod: x.userDays,
        userStakedBal: x.userStakedBal,
        daysLeft: x.daysLeft,
        availableBalance: x.availableBalance,
        depositedTokens: x.depositedTokens,
        rewards: x.rewards,
        daysRate: x.daysRate,
        rewardsRate: x.rewardsRate,
        allowance: x.allowance,
        poolname: "OCICAT TOKENS",
        totalReward: x.totalReward,
        tokenPrice: x.tokenPrice,
      });
    } else if (tabParam === "Pool2") {
      x = await poolTwoData();
      setPoolState({
        totalStaked: x.totalStaked,
        numberOfStakers: x.numberOfStakers,
        lockperiod: x.userDays,
        userStakedBal: x.userStakedBal,
        daysLeft: x.daysLeft,
        availableBalance: x.availableBalance,
        depositedTokens: x.depositedTokens,
        rewards: x.rewards,
        daysRate: x.daysRate,
        rewardsRate: x.rewardsRate,
        allowance: x.allowance,
        poolname: "OCI-WBNB TOKENS",
        totalReward: x.totalReward,
        tokenPrice: x.tokenPrice,
      });
    } else if (tabParam === "Pool3") {
      x = await poolThreeData();
      console.log("wikiw cat", { x });
      setPoolState({
        totalStaked: x.totalStaked,
        numberOfStakers: x.numberOfStakers,
        lockperiod: x.userDays,
        userStakedBal: x.userStakedBal,
        daysLeft: x.daysLeft,
        availableBalance: x.availableBalance,
        depositedTokens: x.depositedTokens,
        rewards: x.rewards,
        daysRate: x.daysRate,
        rewardsRate: x.rewardsRate,
        allowance: x.allowance,
        poolname: "WIKI TOKENS",
        totalReward: x.totalReward,
        tokenPrice: x.tokenPrice,
      });
    } else if (tabParam === "Pool4") {
      x = await poolFourData();
      setPoolState({
        totalStaked: x.totalStaked,
        numberOfStakers: x.numberOfStakers,
        lockperiod: x.userDays,
        userStakedBal: x.userStakedBal,
        daysLeft: x.daysLeft,
        availableBalance: x.availableBalance,
        depositedTokens: x.depositedTokens,
        rewards: x.rewards,
        daysRate: x.daysRate,
        rewardsRate: x.rewardsRate,
        allowance: x.allowance,
        poolname: "ODAO",
        totalReward: x.totalReward,
      });
    } else if (tabParam === null || tabParam === undefined) {
      ///console.log("no param set in",{tabParam})

      x = await poolOneData();
      //console.log("default",{x});
      setPoolState({
        totalStaked: x.totalStaked,
        numberOfStakers: x.numberOfStakers,
        lockperiod: x.userDays,
        userStakedBal: x.userStakedBal,
        daysLeft: x.daysLeft,
        availableBalance: x.availableBalance,
        depositedTokens: x.depositedTokens,
        rewards: x.rewards,
        daysRate: x.daysRate,
        rewardsRate: x.rewardsRate,
        allowance: x.allowance,
        poolname: "OCICAT TOKENS",
        totalReward: x.totalReward,
        tokenPrice: x.tokenPrice,
      });
    }
  };
  useEffect(() => {
    fetchDataGood();
  }, [chainId, isConnected, numberOfDays, tabParam]);

  const handleApproveMax = async () => {
    console.log("clicked me Max");
    if (tabParam === "Pool1") {
      //console.log("we are inside here, there is param pool 1")
      let val = await poolOneData();
      //let x = val.availableBalance;
      //console.log("This is the max button value: ")
      setinputVal(val.availableBalance);

      //console.log({val.availableBalance})
    } else if (tabParam === "Pool2") {
      let val = await poolTwoData();
      setinputVal(val.availableBalance);
    } else if (tabParam === "Pool3") {
      let val = await poolThreeData();
      setinputVal(val.availableBalance);
    } else if (tabParam === "Pool4") {
      let val = await poolFourData();
      setinputVal(val.availableBalance);
    } else if (tabParam === null || tabParam === undefined) {
      //console.log("Inside here , the else no param")
      let val = await poolOneData();
      setinputVal(val.availableBalance);
    }
  };
  const handleWithdrawMax = async () => {
    console.log("clicked me 2");
    if (tabParam === "Pool1") {
      let val = await poolOneData();
      setinputValUnstake(val.depositedTokens);
    } else if (tabParam === "Pool2") {
      let val = await poolTwoData();
      setinputValUnstake(val.depositedTokens);
    } else if (tabParam === "Pool3") {
      let val = await poolThreeData();
      setinputValUnstake(val.depositedTokens);
    } else if (tabParam === "Pool4") {
      let val = await poolFourData();
      setinputValUnstake(val.depositedTokens);
    } else if (tabParam === null || tabParam === undefined) {
      let val = await poolOneData();
      setinputValUnstake(val.depositedTokens);
    }
  };

  // toast.success("Transaction Successful", {
  //   position: "top-right",
  //   autoClose: 5000,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  //   theme: "dark",
  // })

  // toast.error("Message comes here!", {
  //   position: "top-right",
  //   autoClose: 5000,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  //   theme: "dark",
  // });

  return (
    <div className="body">
      <div className="pd_home">
        {loading && <Loader />}
        <ToastContainer />
        <nav>
          <div className="inner_nav">
            <div className="logo_box">
              <img src={logo} alt="OCICATCLUB" />
              <a href="/" className="logo_name">
                OCICAT
              </a>
            </div>
            {/* <img src="" alt="OCICATCLUB" /> */}
            {/* <img src={web3Image} alt="OCICATCLUB" /> */}
            <div className="right_side">
              <Link to="https://dao.ocicat.club" className="website">
                DAO
              </Link>
              {/* <Link to="https://staking.ocicat.club" className="website">
            Staking
          </Link>{" "} */}
              <Link to="https://nft.ocicat.club" className="website">
                NFT
              </Link>
              <Link
                className="buy"
                to="https://pancakeswap.finance/swap?outputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&chainId=56&inputCurrency=0x37Fe635D1e25B2F7276C1B9dBBcc7b087f80C050"
              >
                <span>BUY OCICAT</span>
              </Link>
              {/* <button className="connect">Connected to network: {network}</button> */}
              <w3m-button />
            </div>
          </div>
        </nav>

        <main>
          {/* <section className="buy">
          <img src={web3Image} alt="web3" />
          <div className="right_side">
            <p className="website">Website</p>
            <a className="buy">
              <WalletIcon /> <span>BUY WEB3</span>
            </a>
            <button className="connect">Connect Wallet</button>
          </div>
        </section> */}
          <div className="mask">
            <section className="tabList">
              {tabList.map((item) => (
                <p
                  onClick={() => {
                    setTab(item);
                    navigate(`?tab=${item}`);
                    // changeTab(item);
                  }}
                  className={`single_tab ${tab === item ? "active" : ""}`}
                >
                  {item}
                </p>
              ))}
            </section>
            <div className="banner">
              <img src={banner} className="bannerImage" />
            </div>
            <section className="market">
              <div className="total_w3_market_section">
                <p className="total">
                  TOTAL <span>{poolState?.poolname}</span> STAKED
                </p>
                <p className="token_amount">{poolState?.totalStaked}</p>

                <div className="days_box">
                  <p className="question">How many days:</p>
                  <div className="time_showcase">
                    {[30, 90, 180, 365].map((item) => (
                      <button
                        onClick={() => {
                          setNumberOfDays(item);
                        }}
                        className={`single_time ${
                          item === numberOfDays ? "active" : ""
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lock_period_section">
                  <div className="left_side">
                    <p>Lock period: {poolState?.lockperiod} days</p>
                    <p>
                      Days Left:{" "}
                      {poolState?.daysLeft < 0 ? 0 : poolState?.daysLeft} days
                    </p>
                    <p>
                      Number of stakers:{" "}
                      <span>{poolState?.numberOfStakers}</span>
                    </p>
                    <h4>
                      Rewards: {poolState?.rewards ? poolState?.rewards : 0}
                    </h4>
                    <button
                      onClick={() => {
                        handleClaim();
                      }}
                      className="approve"
                      style={{ cursor: "pointer" }}
                    >
                      Claim
                    </button>
                  </div>

                  <div className="right_side">
                    <h4 className="name">APY</h4>
                    <h4 className="percent">
                      {poolState?.daysRate ? poolState?.daysRate : 0}%
                    </h4>
                  </div>
                </div>

                <div className="balance_flex">
                  <div className="input_container">
                    <label htmlFor="available-balance">
                      AVAILABLE BALANCE: {poolState?.availableBalance}{" "}
                      {poolState?.poolname}
                    </label>
                    <div className="input_flex">
                      <input
                        onChange={(e) => {
                          if (typeof Number(e.target.value) === "number") {
                            setinputVal(e.target.value);
                          }
                          // handleChange(e.target.value);
                        }}
                        type="text"
                        value={inputVal}
                      />
                      <button
                        className="max"
                        type="button"
                        onClick={(e) => {
                          handleApproveMax();
                          //setVal(e.target.value); We can set state here for teh value then make the input field pick the state
                          // handleChange(e.target.value);
                        }}
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  {poolState?.allowance >= Number(inputVal) ? (
                    <button
                      onClick={() => {
                        if (inputVal) {
                          approveOrStake("stake");
                        }
                      }}
                      className="approve"
                      style={{ cursor: "pointer" }}
                    >
                      Stake
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (inputVal) {
                          approveOrStake("approve");
                        }
                      }}
                      className="approve"
                      style={{ cursor: "pointer" }}
                    >
                      Approve
                    </button>
                  )}
                </div>
                <div className="balance_flex">
                  <div className="input_container">
                    <label htmlFor="available-balance">
                      {
                        //alert(poolState?.totalStaked)
                      }
                      STAKED BALANCE: {poolState?.depositedTokens}{" "}
                      {poolState?.poolname}
                    </label>
                    <div className="input_flex">
                      <input
                        onChange={(e) => {
                          if (typeof Number(e.target.value) === "number") {
                            setinputValUnstake(e.target.value);
                          }
                          // handleChange(e.target.value);
                        }}
                        value={inputValUnstake}
                        type="text"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleWithdrawMax();
                        }}
                        className="max"
                      >
                        Max
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleUnStake();
                    }}
                    className="withdraw"
                    style={{ cursor: "pointer" }}
                  >
                    Unstake
                  </button>
                </div>
              </div>
              <div className="market_stat_section">
                <div className="single_market_stat">
                  <div className="text_box">
                    <p className="bold">
                      {poolState?.tokenPrice !== undefined
                        ? `$${poolState?.tokenPrice}`
                        : "$(N/A)"}
                    </p>
                    <p className="light">TOKEN PRICE</p>
                  </div>
                  {/* <ChartIcon /> */}
                </div>
                <div className="single_market_stat">
                  <div className="text_box">
                    <p className="bold">
                      {poolState?.totalStaked !== undefined
                        ? poolState?.totalStaked
                        : "(N/A)"}
                    </p>
                    <p className="light">TOTAL STAKED </p>
                  </div>
                  {/* <ChartIcon /> */}
                </div>
                <div className="single_market_stat">
                  <div className="text_box">
                    <p className="bold">
                      {poolState?.totalReward !== undefined
                        ? poolState?.totalReward
                        : "(N/A)"}
                    </p>
                    <p className="light">TOTAL REWARD</p>
                  </div>
                  {/* <ChartIcon /> */}
                </div>
                {/* {[1, 2, 3].map((item) => (
                <div className="single_market_stat">
                  <div className="text_box">
                    <p className="bold">$(N/A)</p>
                    <p className="light">TOKEN PRICE</p>
                  </div>
                  <ChartIcon />
                </div>
              ))} */}
              </div>
            </section>
            <div className="explanation_box">
              <p className="topic">How to stake</p>
              <p className="explain" style={{ fontFamily: "arial" }}>
                1. Select the pool you wish to stake in.
                <br />
                2. Get the token for the pool at pancakeswap, either direct
                purchase or by providing liquidity.
                <br />
                3. Select the duration you wish to stake for while reviewing the
                APY for each.
                <br />
                4. Approve the amount of tokens you wish to stake.
                <br />
                5. Stake into the pool
                <br />
                <br />
                Best wishes!
              </p>
            </div>
            <div className="explanation_box">
              <p className="topic">ODAO POINTS</p>
              <p className="explain" style={{ fontFamily: "arial" }}>
                1. To improve your scores to get ODAO voting power , chose a
                long stake increase your participation in liquidity pool (pool2)
                <br />
                2. ODAO voting power allows you access to create polls and a
                chunk on airdrop of ODAO token.
                <br />
                3. ODAO token will be airdropped based on ODAO voting power.
                ODAO will fascinate our extention of our project to SOLANA
                network using wormhole bridging protocol.
                <br />
                <a href="#" style={{ color: "white" }}>
                  Read more
                </a>
                <br />
              </p>
            </div>
            <footer>
              <div className="image_flex">
                <TwitterIcon href="https://twitter.com/ocicatcoin" />
                <TelegramIcon href="https://t.me/ocicatcoin" />
              </div>

              <a href="">All Rights Reserved @ 2024</a>
              <p>@2024</p>
            </footer>{" "}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
