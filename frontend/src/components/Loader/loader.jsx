import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import lottie from "lottie-web/build/player/lottie_light";
import "./style.scss";

const SEGMENT_START = 1;
const SEGMENT_LOADING = 2;
const SEGMENT_DONE = 3;

function Loader({ isDone }) {
  const startContainer = useRef(null);
  const loadingContainer = useRef(null);
  const endContainer = useRef(null);

  const [startAnimation, setStartAnimation] = useState(null);
  const [loadingAnimation, setLoadingAnimation] = useState(null);
  const [endAnimation, setEndAnimation] = useState(null);

  const [animationSegment, setAnimationSegment] = useState(-1);

  const loadAnimation = ({ container, loop, path }) =>
    lottie.loadAnimation({
      container: container.current, // the dom element that will contain the animation
      renderer: "svg",
      loop,
      autoplay: false,
      path, // the path to the animation json
    });

  const showStartLoader = () => {
    setAnimationSegment(SEGMENT_START);
    startAnimation?.play();
  };

  const showLoader = () => {
    startAnimation?.goToAndStop(0);
    loadingAnimation?.play();
  };

  const showDoneLoader = () => {
    setAnimationSegment(SEGMENT_DONE);
    endAnimation?.goToAndStop(0);
    endAnimation?.play();
  };

  useEffect(() => {
    if (startContainer.current) {
      setStartAnimation(
        loadAnimation({
          container: startContainer,
          path: "https://images.toruswallet.io/loader-start.json",
          loop: false,
        })
      );
    }

    if (loadingContainer.current) {
      setLoadingAnimation(
        loadAnimation({
          container: loadingContainer,
          path: "https://images.toruswallet.io/loader-loading.json",
          loop: true,
        })
      );
    }

    if (endContainer.current) {
      setEndAnimation(
        loadAnimation({
          container: endContainer,
          path: "https://images.toruswallet.io/loader-end.json",
          loop: false,
        })
      );
    }
  }, [startContainer, loadingContainer, endContainer]);

  useEffect(() => {
    if (isDone) {
      if (endAnimation) {
        showDoneLoader();
      }
    } else if (startAnimation) {
      startAnimation.addEventListener("complete", () => {
        setAnimationSegment(SEGMENT_LOADING);
        showLoader();
      });
      showStartLoader();
    }
  }, [isDone, startAnimation, loadingAnimation, endAnimation]);

  return (
    <>
      <div className="loader-container mb-4">
        <div className="lottie-container" ref={startContainer} style={{ display: animationSegment === SEGMENT_START ? "block" : "none" }}></div>
        <div className="lottie-container" ref={loadingContainer} style={{ display: animationSegment === SEGMENT_LOADING ? "block" : "none" }}></div>
        <div className="lottie-container" ref={endContainer} style={{ display: animationSegment === SEGMENT_DONE ? "block" : "none" }}></div>
      </div>
      <div>
        <div className="heading mb-2">{isDone ? "You are logged in" : "Logging you in"}</div>
        <div className="subheading text3--text">
          {isDone ? "You can close this window and return to your orginal tab" : "We will be there in a few minutes"}
        </div>
      </div>
    </>
  );
}

Loader.propTypes = {
  isDone: PropTypes.bool,
};

export default Loader;
