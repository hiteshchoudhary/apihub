## Live Website Link

[Random Quote Generator](https://quotegenerator-three-henna.vercel.app)        

## 🧠 Dependencies Used

1. React + Vite
2. Tailwind Css
3. tsParticles 

## 🚀 Installation and Setup

1. **Fork** the repo to your GitHub account, then **clone** it to your local machine:
   ```bash
   git clone https://github.com/your-username/repo-name.git
   ```

2. In the root folder, install dependencies:
   ```bash
   npm i
   ```

3. Follow the Tailwind CSS setup guide for Vite:
   👉 [Tailwind Vite Setup](https://tailwindcss.com/docs/installation/using-vite)

4. Install **tsParticles** library for animated background:
   ```bash
   npm i @tsparticles/all
   ```

5. Go to **FreeAPI's documentation**, and find the "Get Quote by ID" section:  
   👉 [FreeAPI Docs](https://freeapi.hashnode.space/api-guide/apireference/getQuoteById)

6. Create a `.env` file in the root folder and paste the content from `.env.sample` into it.

7. Copy the API endpoint URL from the FreeAPI docs and modify it:  
   From:
   ```
   https://api.freeapi.app/api/v1/public/quotes/{quoteId}
   ```
   To:
   ```
   https://api.freeapi.app/api/v1/public/quotes
   ```  
   Then paste this into the `BASE_url` key in your `.env` file (within quotes).

8. Save everything, then run the app:
   ```bash
   clear
   npm run dev
   ```

---

🎉 **Enjoy the app!** 🥳🥳
