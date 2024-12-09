import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

import { LinesDrawer } from './LinesDrawer.jsx';
import CirclesDrawer from './CirclesDrawer.jsx';

import {
  INFORMATIONLOCATIONINSCRITTURA,
  minCircleRadius,
  maxCircleRadius,
  drawTrail,
  numberOfSegments,
  drawLine,
  transparency,
  TIMINGSETTINGSLOCATION,
  PLAYMODALITYSELECTION,
} from '../../helperFiles/constants.js';
import { INFORMATIONLOCATIONINSETTINGS } from '../../helperFiles/accountsHelper.js';
import {
  getCenterPoint,
  getCircleProperties,
  determineDareOrAvereFromAmount,
  getRGBColor,
} from '../../helperFiles/helperFunctions.js';
import { resetDisplayedAccountsInfo } from '../../helperFiles/accountsHelper.js';

const AnimationsHandler = forwardRef(
  (
    {
      scritture,
      displayedAccountsInfo,
      setDisplayedAccountsInfo,
      timingSettings,
      // setShouldLoopOverScrittureExternalCommand:
      // indicates whether the user wants the animations to loop or to be on pause
      // It must be handled here because when there are no more scritture, this component signals it by
      // putting it to false, so that the parent will change some displayed buttons
      setShouldLoopOverScrittureExternalCommand,
      setAnimationsAreOver,
      setVisualizedDate,
      playModality,
    },
    ref
  ) => {
    // using useRef because otherwise it is reset at every render
    var createdCircles = useRef(Number.MIN_SAFE_INTEGER);
    var iteration = useRef(0);

    const nextScritturaDelay =
      timingSettings[TIMINGSETTINGSLOCATION.DELAYBETWEENSCRITTURE];
    const circleLifecycleDuration =
      timingSettings[TIMINGSETTINGSLOCATION.CIRCLELIFECYCLEDURATION];
    const [shouldLoopOverScritture, setShouldLoopOverScritture] =
      useState(false);

    const originalAccounts = new Map(displayedAccountsInfo);
    const [newDisplayedAccountsInfo, setAnimationAccounts] = useState(
      displayedAccountsInfo
    );

    const [circles, setCircles] = useState([]);
    const [toDrawLines, setToDrawLines] = useState([]);

    const arrayOfKeys = Array.from(newDisplayedAccountsInfo.keys());
    const [cellCenters, setCellCenters] = useState(new Map());

    useEffect(() => {
      setShouldLoopOverScrittureExternalCommand(shouldLoopOverScritture);
    }, [shouldLoopOverScritture]);

    //can be called by parent component
    useImperativeHandle(ref, () => ({
      startNextScritturaAnimation() {
        // update accounts location
        updateCellCenters();
        /*
          done here and in the other function to update only in the cases in which buttons are pressed
        */
        startAnimations();
      },
      startScritturaAnimation() {
        // update accounts location
        updateCellCenters();
        /*
          done here and in the other function to update only in the cases in which buttons are pressed.
          In this scenario, the update is done only before the first scrittura is computed, 
          then the values are not modified anymore
        */
        setShouldLoopOverScritture(!shouldLoopOverScritture);
      },
      resetAnimation() {
        resetCircles();
        iteration.current = 0;
      },
    }));

    function updateCellCenters() {
      const cellCenters = new Map(
        arrayOfKeys.map((key) => [
          key,
          extractInfoFromSelectedCellsHTML(document, key),
        ])
      );
      setCellCenters(cellCenters);
    }

    useEffect(() => {
      setAnimationsAreOver(circles.length == 0);
    }, [circles]);

    useEffect(() => {
      setDisplayedAccountsInfo(newDisplayedAccountsInfo);
    }, [newDisplayedAccountsInfo]);

    function startAnimations() {
      renderNewScrittura();
      iteration.current = (iteration.current + 1) % scritture.length;
      if (iteration.current == 0) setShouldLoopOverScritture(false); //if end of scritture was reached
    }

    function renderNewScrittura() {
      const toDrawCircles = [];
      const scrittura = scritture[iteration.current];
      if (arrayOfKeys.length < 2) {
        console.log(
          'Non ci sono abbastanza celle riempite per spostare le palline.'
        );
        return;
      }

      const cellsInScrittura = scrittura.map((element) => {
        return cellCenters.get(element[INFORMATIONLOCATIONINSCRITTURA.ACCOUNT]);
      });

      const centerOfRCOfCurrentScrittura = getCenterPoint(cellsInScrittura);
      for (const line of scrittura) {
        const lineAmount = line[INFORMATIONLOCATIONINSCRITTURA.AMOUNT];
        const rcCellCenter = cellCenters.get(
          line[INFORMATIONLOCATIONINSCRITTURA.ACCOUNT]
        );
        const {
          circleStartLocation,
          circleEndLocation,
          circleDuration,
          circleDelay,
        } = getCircleProperties(
          centerOfRCOfCurrentScrittura,
          rcCellCenter,
          determineDareOrAvereFromAmount(lineAmount),
          circleLifecycleDuration
        );
        var computedRadius =
          Math.abs(line[INFORMATIONLOCATIONINSCRITTURA.NORMALIZEDAMOUNT]) *
          maxCircleRadius;

        // Clamp the calculated value between the minimum and maximum
        computedRadius = Math.max(minCircleRadius, computedRadius);

        if (drawTrail) {
          // Calculate the distance and direction between start and end points
          const deltaX =
            (circleEndLocation.x - circleStartLocation.x) / numberOfSegments;
          const deltaY =
            (circleEndLocation.y - circleStartLocation.y) / numberOfSegments;

          for (let i = 0; i <= numberOfSegments; i++) {
            const currentX = circleStartLocation.x + deltaX * i;
            const currentY = circleStartLocation.y + deltaY * i;

            const newCircle = {
              id: createdCircles.current++,
              startX: currentX,
              startY: currentY,
              color: getRGBColor(line[INFORMATIONLOCATIONINSCRITTURA.COLOR]),
              endX: currentX, // These are the same for trail circles, as they do not move further
              endY: currentY,
              radius: computedRadius,
              duration: circleDuration / numberOfSegments, // Split duration equally among all segments
              delay: circleDelay + i * (circleDuration / numberOfSegments), // Incremental delay for each segment
              amount: lineAmount,
              account: line[INFORMATIONLOCATIONINSCRITTURA.ACCOUNT],
              isFirstOrLast:
                (i == 0 && lineAmount < 0) || //avere
                (i == numberOfSegments - 1 && lineAmount > 0), //dare
            };

            toDrawCircles.push(newCircle);
          }
        } else {
          const newCircle = {
            id: createdCircles.current++,
            startX: circleStartLocation.x,
            startY: circleStartLocation.y,
            color: getRGBColor(line[INFORMATIONLOCATIONINSCRITTURA.COLOR]),
            endX: circleEndLocation.x,
            endY: circleEndLocation.y,
            radius: computedRadius,
            duration: circleDuration,
            delay: circleDelay,
            amount: lineAmount,
            account: line[INFORMATIONLOCATIONINSCRITTURA.ACCOUNT],
          };

          toDrawCircles.push(newCircle);
        }
        if (drawLine) {
          const transparentColor = getRGBColor(
            line[INFORMATIONLOCATIONINSCRITTURA.COLOR]
          )
            .replace('rgb', 'rgba')
            .replace(')', ', ' + transparency + ')');

          const newLine = {
            id: createdCircles.current++,
            startLocation: circleStartLocation,
            endLocation: circleEndLocation,
            width: computedRadius * 2,
            color: transparentColor,
            lineDuration: circleLifecycleDuration,
          };
          setToDrawLines((prevToDrawLines) => [...prevToDrawLines, newLine]);
        }

        setVisualizedDate(line[INFORMATIONLOCATIONINSCRITTURA.DATE]);
      }

      setCircles((prevCircles) => [...prevCircles, ...toDrawCircles]);
    }

    function deleteCircle(circleId) {
      setCircles((prevItems) =>
        prevItems.filter((item) => item.id !== circleId)
      );
    }

    function deleteLine(lineId) {
      setToDrawLines((prevItems) =>
        prevItems.filter((item) => item.id !== lineId)
      );
    }

    // calls startAnimations in a loop
    useEffect(() => {
      if (shouldLoopOverScritture) {
        const intervalId = setInterval(startAnimations, nextScritturaDelay);

        return () => {
          clearInterval(intervalId);
        };
      }
    }, [shouldLoopOverScritture]);

    function onCircleAnimationStarted(AccountLabel, amount) {
      /*
      1. Avere are always negative
      2. The circles representing an avere line start from the  account and go to the center,
      so the value of the circle must be added to the cell when they appear
      */
      if (amount < 0) addAccountAmount(AccountLabel, amount);
    }

    function onCircleAnimationCompleted(circleId, AccountLabel, amount) {
      if (!drawTrail) deleteCircle(circleId);
      /*
      1. Dare are always positive
      2. The circles representing a dare line start from the center and go to the  account,
      so the value of the circle must be added to the cell when they disappear
      */
      if (amount > 0) addAccountAmount(AccountLabel, amount);
    }

    function onLineAnimationCompleted(lineId) {
      if (playModality == PLAYMODALITYSELECTION.CIRCLES) deleteLine(lineId);
    }

    function addAccountAmount(account, amount) {
      const newMap = new Map(newDisplayedAccountsInfo);
      const informations = newMap.get(account);

      informations[INFORMATIONLOCATIONINSETTINGS.AMOUNT] += amount;

      setAnimationAccounts(newMap);
    }

    function resetCircles() {
      setCircles([]);
      setAnimationAccounts(originalAccounts);
      setDisplayedAccountsInfo(
        resetDisplayedAccountsInfo(displayedAccountsInfo)
      );
    }

    function extractInfoFromSelectedCellsHTML(document, key) {
      // Get the DOM elements of the selected cells

      var startX, startY;
      try {
        const startCellElement = document.getElementById(key);
        const startRect = startCellElement.getBoundingClientRect();

        // Compute the center of each cell
        startX = startRect.left + startRect.width / 2;
        startY = startRect.top + startRect.height / 2;
      } catch {
        return { x: 0, y: 0 };
      }
      return { x: startX, y: startY };
    }

    return (
      <div className="animations">
        <LinesDrawer
          toDrawLines={toDrawLines}
          onAnimationCompleted={onLineAnimationCompleted}
        />
        <CirclesDrawer
          circles={circles}
          onAnimationStarted={onCircleAnimationStarted}
          onAnimationCompleted={onCircleAnimationCompleted}
        />
      </div>
    );
  }
);

export default AnimationsHandler;
