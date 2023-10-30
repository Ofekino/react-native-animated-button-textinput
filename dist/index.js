import React, { Component } from "react";
import { Text, View, Animated, TouchableOpacity, TextInput } from "react-native";

class AnimatedButtonTextInput extends Component {
  state = {
    height: new Animated.Value(this.props.collapsedHeight),
    width: new Animated.Value(this.props.collapsedWidth),
    scale: new Animated.Value(0),
    isCollapsed: true,
    rightButtonPressed: false, // New flag to track right button press
  };

  handlePress = () => {
    if (this.state.isCollapsed) {
      this.props.onCollapsedPress();
      Animated.parallel([
        Animated.timing(this.state.width, {
          duration: this.props.animationDuration,
          toValue: this.props.expandedWidth,
        }),
        Animated.timing(this.state.scale, {
          duration: this.props.animationDuration,
          toValue: 1,
        }),
      ]).start(() => this.setState({ isCollapsed: false }));
    } else if (this.state.rightButtonPressed) {
      // Check the rightButtonPressed flag
      this.props.onExpandedPress();
      Animated.parallel([
        Animated.timing(this.state.width, {
          duration: this.props.animationDuration,
          toValue: this.props.collapsedWidth,
        }),
        Animated.timing(this.state.scale, {
          duration: this.props.animationDuration,
          toValue: 0,d
        }),
      ]).start(() => this.setState({ isCollapsed: true, rightButtonPressed: false }));
    }
  };

  setRightButtonPressed = () => {
    this.setState({ rightButtonPressed: true }, () => {
      this.handlePress(); // Trigger animation immediately after setting flag
    });
  };
  

  expandedContentScale = this.state.scale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  collapsedContentScale = this.state.scale.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  render() {
    const collapsedPropsStyle =
      (this.props.collapsedProps && this.props.collapsedProps.style) || {};
    const componentPropsStyle =
      (this.props.componentProps && this.props.componentProps.style) || {};

    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={this.handlePress}>
          <Animated.View
            {...this.props.componentProps}
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              justifyContent: "center",
              ...componentPropsStyle,
              height: this.state.height,
              width: this.state.width,
            }}
          >
            <Animated.View
              style={{
                justifyContent: "center",
                alignItems: "center",
                ...collapsedPropsStyle,
                opacity: this.collapsedContentScale,
                transform: [
                  { scaleX: this.collapsedContentScale },
                  { scaleY: this.collapsedContentScale },
                ],
              }}
            >
              {this.props.collapsedContent() || <Text>Notify me</Text>}
            </Animated.View>
            <Animated.View
              style={{
                position: "absolute",
                flexDirection: "row",
                opacity: this.expandedContentScale,
                transform: [
                  { scaleX: this.expandedContentScale },
                  { scaleY: this.expandedContentScale },
                ],
              }}
            >
              <TextInput
                style={{ flex: 1, marginLeft: 20 }}
                autoCapitalize={"none"}
                // placeholder={"Email"}
                {...this.props.textInputProps}
              />
              <TouchableOpacity
                style={{
                  height: this.props.collapsedHeight - 8,
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 4,
                }}
                {...this.props.rightButtonProps}
                onPress={() => {
                  this.setRightButtonPressed(); // Set the flag
                  this.props.rightButtonProps.onPress(); // Call the provided onPress function
                }}
              >
                {this.props.rightButtonContent() || (
                  <Text style={{ color: "white" }}>Send</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

AnimatedButtonTextInput.defaultProps = {
  animationDuration: 300,
  collapsedWidth: 100,
  collapsedHeight: 40,
  expandedWidth: 300,
  expandedHeight: 40,
  onCollapsedPress: () => null,
  onExpandedPress: () => null,
  rightButtonContent: () => null,
  collapsedContent: () => null,
};

export { AnimatedButtonTextInput };
