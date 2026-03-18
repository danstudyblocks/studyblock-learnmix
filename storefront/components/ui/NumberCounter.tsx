import CountUp from "react-countup";
const NumberCounter = ({ start, end }: { start: number; end: number }) => {
  return (
    <CountUp
      duration={3}
      delay={0}
      start={start}
      end={end}
      enableScrollSpy
      scrollSpyOnce
    >
      {({ countUpRef }) => <span ref={countUpRef} />}
    </CountUp>
  );
};
export default NumberCounter;
