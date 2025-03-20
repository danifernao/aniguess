interface RndCharLoadingProps {
  errorFound: boolean;
  transl: {
    intro: string;
    delay: string;
    error: string;
  };
}

function RndCharLoading({ errorFound, transl }: RndCharLoadingProps) {
  return (
    <div className={`loading ${errorFound ? "error" : ""}`}>
      {errorFound ? (
        <p>{transl.error}</p>
      ) : (
        <>
          <p>{transl.intro}</p>
          <p>{transl.delay}</p>
        </>
      )}
    </div>
  );
}

export default RndCharLoading;
