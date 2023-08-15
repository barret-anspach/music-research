import styles from './page.module.css'
import { BaseN } from 'js-combinatorics';

const seed = {
  static: {
    parts: 4,
    polyphony: 4, // number of voices a "part" can play; here assumes all parts have same capabilities. should refactor so parts is [{polyphony: n}, …]
  },
  sets: {
    pitches: ['A', 'B', 'C', 'D', 'E'],
    timeSignatures: ['4/4', '6/8', '5/16'],
    divisionsInMeasure: ['3', '4', '5'],
  },
};

const repeat = (arr, n) => [].concat(...Array(n).fill(arr));

const generate = () => {
  for (let key in seed.sets) {
    console.log(seed.sets[key].length)
  }
  const basePitches = [...new BaseN(seed.sets.pitches, seed.static.parts)]
  const baseTimeSignatures = [...new BaseN(seed.sets.timeSignatures, seed.static.parts)]
  const baseDivisions = [...new BaseN(seed.sets.divisionsInMeasure, seed.static.parts)]
  const longestBase = [basePitches.length, baseTimeSignatures.length, baseDivisions.length].reduce((acc, current) => current > acc ? current : acc, 0)
  const shortestBase = [basePitches.length, baseTimeSignatures.length, baseDivisions.length].reduce((acc, current) => current < acc ? current : acc, longestBase)
  const modulo = basePitches.length % baseTimeSignatures.length % baseDivisions.length
  const multiple = Math.ceil(longestBase / shortestBase)
  console.log(parseInt(multiple.toString()))
  const pitches = basePitches.length > baseTimeSignatures.length || basePitches.length > baseDivisions.length
      ? basePitches
    : repeat(basePitches, multiple).slice(0, longestBase)
  const timeSignatures = baseTimeSignatures.length > basePitches.length || baseTimeSignatures.length > baseDivisions.length
    ? baseTimeSignatures
    : repeat(baseTimeSignatures, multiple).slice(0, longestBase)
  const tuplets = baseDivisions.length > basePitches.length || baseDivisions.length > baseTimeSignatures.length
    ? baseDivisions
    : repeat(baseDivisions, multiple).slice(0, longestBase)
  console.log(timeSignatures)

  return {
    pitches,
    timeSignatures,
    tuplets,
  }
}

const seedResult = generate()

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.timeSignatureColumn}>
        {seedResult.timeSignatures.map((tsigSet, index) => (
          <div
            key={`tsigset-${index}`}
            className={styles.timeSignatureSet}
          >
            <label className={styles.systemLabel}>{index + 1}</label>
            {tsigSet.map((tsig, tsigIndex) => (
              <div
                key={`tsigset-${index}-tsig-${tsigIndex}`}
                className={styles.timeSignature}
              >
                {tsig.split('/').map((number, numberIndex) => (
                  <div
                    key={`tsigset-${index}-tsig-${tsigIndex}-${numberIndex === 0 ? 'numerator' : 'denominator'}`}
                    className={numberIndex === 0 ? styles.timeSignatureNumerator : styles.timeSignatureDenominator}
                  >
                    {number}
                  </div>
                ))
                }
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        {seedResult.pitches.map((pitchSet, index) => (
          <div
            className={styles.pitchSet}
            key={`pitch-${index}`}
          >
            {pitchSet.map((pitch, playerIndex) => (
              <div 
                key={`pitch-${index}-player-${playerIndex}`} 
                className={`${styles.pitch} ${styles[`pitch-${pitch}`]}`}
              >
                {pitch}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        {seedResult.tuplets.map((tupletSet, index) => (
          <div
            className={styles.tupletSet}
            key={`tuplet-${index}`}
          >
            {tupletSet.map((tuplet, tupletIndex) => (
              <div
                key={`tupletSet-${index}-tuplet-${tupletIndex}`}
                className={styles.tuplet}>
                {tuplet}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  )
}
