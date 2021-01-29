/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, Component } from 'react';
import 'react-native-gesture-handler';
import { TextInput, TouchableOpacity, FlatList, ActivityIndicator, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


class SearchView extends Component {

    state = {
        user_input_first: '',
        user_input_last: '',
        data: ''
    }
    onPress_first = (text) => {
            this.setState({ user_input_first: text })
    }
    onPress_last = (text) => {
        this.setState({ user_input_last: text })
    }
    toLink = () => {
        let url = 'https://npiregistry.cms.hhs.gov/api/?';
        if (this.state.user_input_first) {
            url = url + 'first_name=' + this.state.user_input_first;
        }
        if (this.state.user_input_last) {
            url = url + (this.state.user_input_first ? '&': '') +'last_name=' + this.state.user_input_last;
        }
        url = url + '&city=&limit=20&version=2.1';
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    data: responseJson
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    cases = () => {
        return (
            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.toLink()}
                >
                    <Text>Search</Text>
                </TouchableOpacity>
            </View>
        );
}

    render() {
        const {navigation} = this.props

        return (
            <View>
                <Text>NPI Registry Search</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={this.onPress_first}
                />
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={this.onPress_last}
                />
                {this.cases()}
                <View style={styles.flatliststyle}>
                <FlatList
                        data={this.state.data.results}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <Button title={item.basic.first_name + " " + item.basic.last_name + "    " + item.addresses[0].city + ", " + item.addresses[0].state} onPress={() => navigation.navigate('Profile', { item: item })}/>}
                        style={styles.flatliststyle}
                />
                </View>
            </View>
        )
    }
}
const profile = ({ navigation, route }) => {
    if (route.params.item) {
        return <Text>{route.params.item.basic.first_name + ' ' + route.params.item.basic.last_name + '       ' + route.params.item.addresses[0].city + ', ' + route.params.item.addresses[0].state}</Text>;
    }
    return <Text> </Text>
};
const App = () => {
    const Stack = createStackNavigator();
    let object;
    object = new SearchView();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={SearchView} />
                <Stack.Screen name="Profile" component={profile}/>
      </Stack.Navigator>
        </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
    },
    list_item: {
        color: "red"
    },
    flatliststyle: {
        margin: 15,
        alignContent: 'center',
        textAlignVertical: 'center'
    }
});

export default App;
