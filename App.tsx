import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Container } from "./components/container";
import { Dimensions } from "react-native";
import { useEffect, useRef, useState } from "react";

type Tile = {
  color: string;
  isOdd: boolean;
};

const getRandomNumber = () => Math.floor(Math.random() * 256);

const getRandomColor = () => {
  return [getRandomNumber(), getRandomNumber(), getRandomNumber()];
};

const getRandomColors = (length: number, margin: number) => {
  const tiles = [];
  const color = getRandomColor();
  for (let i = 0; i < length; i++) {
    tiles.push({
      color: `rgb(${color[0]},${color[1]},${color[2]})`,
      isOdd: false,
    });
  }
  const randomIndex = Math.floor(Math.random() * length);
  tiles[randomIndex] = {
    color: `rgb(${color[0] + margin},${color[1] + margin},${
      color[2] + margin
    })`,
    isOdd: true,
  };
  return tiles;
};

export default function App() {
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [start, setStart] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [tiles, setTiles] = useState<Tile[]>(getRandomColors(9, 100));

  const restart = () => {
    return (
      setIsGameOver(false),
      setSeconds(30),
      setStart(false),
      handleCorrect(),
      setScore(0)
    );
  };

  useEffect(() => {
    if (seconds === 0 || seconds < 0) {
      // !GAME OVER
      setIsGameOver(true);
      clearInterval(intervalRef.current!);
      if (score > highScore) {
        setHighScore(score);
      }
    }
    intervalRef.current = setInterval(() => {
      setSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [seconds]);

  const handleCorrect = () => {
    setScore(score + 1);
    const newTiles = getRandomColors(9, 100 / score);
    setTiles(newTiles);
  };

  return (
    <Container>
      <Text style={styles.title}>
        Өөр <Text style={styles.oddTitle}>өнгийг</Text> ол!
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 140,
        }}
      >
        <Text style={styles.highscore}>Таны дээд оноо: {highScore}</Text>
        <Pressable
          style={{
            height: 35,
            width: 35,
            // backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={restart}
        >
          <Text
            style={{
              fontSize: 30,
            }}
          >
            ↻
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.score}>{seconds} секунд</Text>
        <Text style={styles.score}>Оноо: {score}</Text>
      </View>
      <View style={styles.board}>
        {tiles.map((tile, index) => (
          <View style={styles.tileGrid} key={`tile-${index}`}>
            <TouchableOpacity
              onPress={() => {
                if (tile.isOdd) {
                  handleCorrect();
                  setSeconds(seconds + 1);
                } else {
                  setSeconds(seconds - 3);
                }
              }}
            >
              <View
                style={{ ...styles.tile, backgroundColor: tile.color }}
              ></View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {isGameOver && (
        <View style={styles.gameOverView}>
          <Text style={styles.highscore}>Таны дээд оноо: {highScore}</Text>
          <Text style={styles.gameOverText}>
            Таны өнгө ялгах хэмжээ эндээс хэтрэхгүй нь бололтой. :({"\n"}
            {"\n"}
            {"\n"} Таны оноо: {score}{" "}
          </Text>
          <Pressable style={styles.button} onPress={restart}>
            <Text style={styles.buttonText}>Дахин эхлэх</Text>
          </Pressable>
        </View>
      )}
      {start && (
        <View style={styles.start}>
          <Text style={styles.title}>
            Өөр <Text style={styles.oddTitle}>өнгийг</Text> ол!
          </Text>
          <Text style={{ fontSize: 20, paddingTop: 20 }}>
            Ар юу колорблаянд плэе дис гээм айнд чэк
          </Text>
          <Pressable style={styles.button} onPress={restart}>
            <Text style={styles.buttonText}>Эхлэх</Text>
          </Pressable>
        </View>
      )}
      <Text style={{ position: "absolute", bottom: 25, right: 20 }}>
        Дандарбаатарын бүтээл ккк {"\n"}Instagram: _dandarbaatar_
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  highscore: {
    color: "#202635",
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  buttonText: {
    color: "#9EC8B9",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    height: 60,
    width: 150,
    backgroundColor: "#1B4242",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  start: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#5C8374",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(92,131,116,0.9)",
    paddingTop: 200,
    alignItems: "center",
  },
  gameOverText: {
    color: "#092635",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#092635",
  },
  oddTitle: {
    color: "#9EC8B9",
  },
  score: {
    color: "#092635",
    fontSize: 30,
    fontFamily: "Arial",
  },
  board: {
    height: 500,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    gap: 8,
  },
  tileGrid: {
    width: (Dimensions.get("window").width - 32) / 3,
  },
  tile: {
    width: "100%",
    height: 0,
    paddingBottom: "100%",
    backgroundColor: "red",
    borderRadius: 13,
  },
  second: {
    color: "#092635",
    fontSize: 30,
    fontFamily: "Arial",
  },
});
