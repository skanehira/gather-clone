# Gather Clone

## This is clone of Gather.town with fully customizable spaces and seamless proximity based video chat.

This project is a fork of Realms, my previous project inspired by Gather. You can check it out [here.](https://github.com/trevorwrightdev/realms)

This app was designed to have the core features of Gather. It contains:

- Customizable spaces using tilesets
- Proximity video chat
- Private area video chat 
- Multiplayer networking
- Tile-based movement

This is a TypeScript web app primarily built with Next.js, Supabase, Socket.io, TailwindCSS, Pixi.js, and Agora for video chat. 

### How to install

First, clone the repo.
`git clone https://github.com/trevorwrightdev/gather-clone.git`

Install client dependencies.
```bash
cd frontend
npm install
```

Install server dependencies.
```bash
cd backend
npm install
```

Since this project uses both Supabase and Agora, you will need to create a Supabase project and an Agora project.

Create a .env file in the `backend` directory with the following variables:
```
FRONTEND_URL=
SUPABASE_URL=
SERVICE_ROLE=
```

Create a .env.local file in the `frontend` directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_BACKEND_URL=
SERVICE_ROLE=
NEXT_PUBLIC_AGORA_APP_ID=
APP_CERTIFICATE=
```

Lastly, run `npm run dev` in both the `frontend` and `backend` directories.
