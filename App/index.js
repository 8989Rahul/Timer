/* eslint-disable react/no-deprecated */
/* eslint-disable react/state-in-constructor */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Picker,
  Platform,
} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#FF851B",
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
  timerText: {
    color: "#fff",
    fontSize: 90,
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
        marginLeft: 10,
      },
    }),
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const formateNumbers = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return { minutes: formateNumbers(minutes), seconds: formateNumbers(seconds) };
};

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

const AVILABLE_MINUTES = createArray(10);
const AVILABLE_SECONDS = createArray(60);

export default class App extends React.Component {
  state = {
    remainigSeconds: 5,
    isRunning: false,
    selectedMinutes: "0",
    selectedSeconds: "5",
  };

  interval = null;

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.remainigSeconds === 0 && prevState.remainigSeconds !== 0) {
      this.stop();
    }
  }

  start = () => {
    this.setState((state) => ({
      remainigSeconds:
        parseInt(state.selectedMinutes, 10) * 60 +
        parseInt(state.selectedSeconds, 10),
      isRunning: true,
    }));
    this.interval = setInterval(() => {
      this.setState((state) => ({
        remainigSeconds: state.remainigSeconds - 1,
      }));
    }, 1000);
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({ remainigSeconds: 5, isRunning: false });
  };

  renderPickers = () => {
    return (
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedMinutes}
          onValueChange={(itemValue) => {
            // update the state
            this.setState({ selectedMinutes: itemValue });
          }}
          mode="dropdown"
        >
          {AVILABLE_MINUTES.map((value) => (
            <Picker key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>minutes</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedSeconds}
          onValueChange={(itemValue) => {
            // update the state
            this.setState({ selectedSeconds: itemValue });
          }}
          mode="dropdown"
        >
          {AVILABLE_SECONDS.map((value) => (
            <Picker key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>seconds</Text>
      </View>
    );
  };

  render() {
    const { minutes, seconds } = getRemaining(this.state.remainigSeconds);
    return (
      <View style={styles.container}>
        {this.state.isRunning ? (
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
        ) : (
          this.renderPickers()
        )}

        {this.state.isRunning ? (
          <TouchableOpacity
            onPress={this.stop}
            style={[styles.button, styles.buttonStop]}
          >
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
