import { GetServerSideProps } from "next";
import Layout from "../components/Layout";

interface Props {
  img_url: string;
  code: string;
}

export default function Home(props: Props) {
  return <Layout image={props.img_url} code={props.code} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const c = context.req.url.split("?")[1].split("c=")[1].split("&")[0];
  return {
    props: {
      img_url: `https://repl-this.vercel.app/api/py.png?c=${c}`,
      code: c,
    },
  };
};
