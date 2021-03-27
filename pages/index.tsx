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
  const c = "a%3Dlambda+x%3A+x%2A2%3B+b=1/a(2)%0Ab-3;c=4;d=5;e=8;a(2)-b-c-d";
  return {
    props: {
      img_url: `//${process.env.VERCEL_URL}/api/py.png?c=${c}`,
      code: c,
    },
  };
};
