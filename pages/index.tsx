import fs from "fs/promises";
import path from "path";

import Title from "@/components/layout/title";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

function Home(props) {
  const { products } = props;

  return (
    <div
      className={`flex flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Title name="Home" />
    </div>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return {
    props: {
      products: data.products,
    },
  };
}

export default Home;
