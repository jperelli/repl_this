import Head from "next/head";

const Layout: React.FC<{ image: string; code: string }> = (props) => {
  return (
    <>
      <Head>
        <meta property="og:image" content={props.image} />
        <meta property="og:title" content="repl_this: python interpreter" />
        <title>repl_this: python interpreter</title>
        <link rel="icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:title"
          content="repl_this: python interpreter"
          key="title"
        />

        <meta
          property="og:image"
          itemProp="image"
          content={props.image}
          key="image"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="675" />
      </Head>

      <div className="max-w-screen-xl mx-auto">
        <header className="flex items-center justify-between py-2 border-b">
          <p className="px-2 lg:px-0">🐍</p>
        </header>

        <main className="mt-10">
          <div className="px-4 lg:px-0 mt-12 text-gray-700 max-w-screen-md mx-auto text-lg leading-relaxed">
            {props.code && (
              <div>
                received raw code string:{" "}
                <code className="bg-gray-200">{props.code}</code>
              </div>
            )}
            <p className="pb-6">
              Here you can see a prettified version of the code string and the
              result of executing it via IPython
            </p>
            <div
              className="mb-4 md:mb-0 w-full max-w-screen-md mx-auto relative"
              style={{ height: "24em" }}
            >
              <img
                src={props.image}
                className="absolute left-0 top-0 w-full h-full z-0 object-cover"
              />
            </div>
            <p className="pb-6">
              This image has been generated on the fly using a serverless vercel
              python function
            </p>
            <p className="pb-6">
              You can see the code that generated this image{" "}
              <a
                className="font-bold"
                href="https://github.com/jperelli/repl_this"
              >
                here
              </a>
            </p>
            <h2 className="text-2xl text-gray-800 font-semibold mb-4 mt-4">
              A simple explanation of how it works
            </h2>
            <ol className="list-decimal ml-5 pb-6">
              <li>GET Request to /py</li>
              <li>Vercel serves html file to the client</li>
              <li>Browser: GET /api/py.png</li>
              <li>
                Vercel executes lambda function /api/py.png.ts
                <ol className="list-decimal ml-10">
                  <li>
                    GET /api/py_pretty: prettyfies the code using ptyhon-black
                  </li>
                  <li>
                    GET /api/py_exec: executes the code using IPython and
                    returns stdout
                  </li>
                  <li>html from template.html with mustache</li>
                  <li>uses playwright to get a screenshot of the html</li>
                  <li>return the image to the client</li>
                </ol>
              </li>
            </ol>
            <p>
              An og:image tag is set so that this also works on the fly for
              twitter and social media
            </p>
            <div className="container mx-auto px-6">
              <div className="mt-16 border-t-2 border-gray-300 flex flex-col items-center">
                <div className="sm:w-2/3 text-center py-6">
                  <p className="text-sm font-bold mb-2">
                    <a href="https://jperelli.com.ar">
                      Made with ❤ by jperelli
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
