# 🙌 BlessedBits – Inspire. Share. Earn.

**BlessedBits** is a Web3-powered short video platform that gives a voice to **faith-based**, **motivational**, and **purpose-driven creators**.

Built on the **Sui blockchain**, it replaces algorithmic gatekeeping with transparent on-chain voting, tipping, staking, and token-based rewards — enabling creators to **own their content**, **earn fairly**, and **build authentic audiences**.

## Key Features

| Feature                | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| **zkLogin Onboarding** | Sign up instantly using Google – no wallet required       |
| **Video Uploads**      | Store short videos on **Walrus decentralized storage**    |
| **On-Chain Voting**    | Transparent community voting stored on the Sui blockchain |
| **Token Staking**      | Stake $BLESS to boost your voting power                   |
| **Unstaking Rewards**  | Earn back $BLESS tokens over time                         |
| **Direct Tipping**     | Instantly tip creators with $BLESS                        |
| **Daily Cashback**     | Claim free $BLESS tokens daily                            |
| **Token Purchase**     | Buy $BLESS (10000 BLESS = 1 SUI)                          |
| **NFT Badges**         | Milestone NFTs like “First Upload”, “Top Creator”         |
| **FaithBadges**        | Verified creator recognitions minted as NFTs              |
| **Follow System**      | On-chain follower relationships                           |
| **Mobile-First UI**    | Clean, responsive, and user-friendly design               |

## Tech Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| **Frontend**   | Vite + React, CSS modules (Responsive)                         |
| **Backend**    | Sui Move smart contracts                                       |
| **Auth**       | Enoki zkLogin (by Mysten Labs), ConnectButton (by Mysten Labs) |
| **Storage**    | Walrus (Decentralized)                                         |
| **Blockchain** | Sui Blockchain                                                 |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Sui CLI](https://docs.sui.io/build/install)
- [Sui Wallet Extension](https://chrome.google.com/webstore/detail/sui-wallet/)
- [Walrus](https://sdk.mystenlabs.com/walrus) or a public IPFS service

### 1. Clone the repository

```bash
git clone https://github.com/Freedteck/blessed-bits.git
cd blessed-bits
```

### 2. Update the Frontend

```bash
cd blessedbits_client
```

Add `.env.local` to the root of the client with the following:

```bash
VITE_ENOKI_PUBLIC_API_KEY=<YOUR ENOKI PUBLIC API KEY>
VITE_GOOGLE_CLIENT_ID=<YOUR GOOGLE CLIENT ID>
VITE_FACEBOOK_APP_ID=<YOUR FACEBOOK APP ID>
```

### 3. Run the Frontend

```bash
npm install
npm run dev
```

Then visit: http://localhost:5173

## Smart Contract Overview

### Some Core Functions

- `register_user()`

- `upload_video()`

- `vote()`

- `send_tip()`

- `update_profile()`

- `claim_cashback() (available once every 24 hours)`

- `award_badge()`

- `purchase_tokens() (exchange SUI for BLESS tokens)`

### Some Events Emitted

- `UserRegistered`

- `VideoUploaded`

- `VoteCast`

- `TipSent`

- `ProfileUpdated`

- `CashbackClaimed`

- `BadgeAwarded`

Live URL: [https://blessed-bits.vercel.app/](https://blessed-bits.vercel.app/)

Pitch: [pitch](./pitch/blessedbits.pdf)
