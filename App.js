import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [inputText, setInputText] = useState();

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    saveTodo(todos);
  }, [todos]);

  const saveTodo = async (todos) => {
    try {
      const todoListSave = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", todoListSave);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodos = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log;
    }
  };
  const addTodo = () => {
    if (textInput == "") {
      Alert.alert("Error", "Please input todo");
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput("");
    }
  };

  const markTodoComplete = (todoId) => {
    const newTodosItem = todos.map((item) => {
      if (item.id == todoId) {
        return { ...item, completed: true };
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodo = (todoId) => {
    const newTodosItem = todos.filter((item) => item.id != todoId);
    setTodos(newTodosItem);
  };

  const deleteAllTodo = () => {
    Alert.alert("Confirm", "you want to clear todoList?", [
      {
        text: "Yes",
        onPress: () => setTodos([]),
      },
      {
        text: "No",
      },
    ]);
  };
  const editHandler = () => {
    console.log("Click on edit Section");
  };
  // const renderItem = ({item,index}) => {
  //   return (
  //     <TouchableOpacity onPress={}>

  //     </TouchableOpacity>
  //   )
  // }

  const edit = () => {
    console.log("Edit");
  };
  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: "#1f145c",
              textDecorationLine: todo?.completed ? "line-through" : "none",
            }}
            onPress={editHandler}
            // <Modal
            //   animationType="fade"
            //   visible={isModelVisible}
            //   onRequestClose={() => setIsModelVisible(false)}
            // >
            //   <View style={styles.modelView}>
            //     <Text style={styles.text}>Change Text</Text>
            //     <TextInput
            //       style={styles.textInput}
            //       onChangeText={(text) => setInputText(text)}
            //       defaultValue={inputText}
            //       editable={true}
            //       multiline={false}
            //       maxLength={200}
            //     />
            //     <TouchableOpacity
            //       // onPress={() => onPressSaveEdit()}
            //       style={styles.touchableSave}
            //     >
            //       <Text style={styles.text}>Save</Text>
            //     </TouchableOpacity>
            //   </View>
            // </Modal>
          >
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View style={[styles.actionIcon, { backgroundColor: "green" }]}>
              <Icon name="done" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            <Icon name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => edit(todo.id)}>
          <View style={styles.actionIcon}>
            <Icon name="edit" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <Text style={styles.toDoHeader}>To Do App List</Text>
        <Icon name="delete" size={25} color="red" onPress={deleteAllTodo} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Add Todo"
            onChangeText={(text) => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoHeader: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#1f145c",
  },
  listItem: {
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  ListItemText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#1f145c",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: "#fff",
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: "#1f145c",
    elevation: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    marginLeft: 5,
    borderRadius: 3,
  },
  text: {
    marginVertical: 30,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
  },
  textInput: {
    width: "90%",
    height: 70,
    borderColor: "grey",
    borderWidth: 1,
    fontSize: 25,
  },
  modelView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  touchableSave: {
    backgroundColor: "blue",
    paddingHorizontal: 100,
    alignItems: "center",
    marginTop: 20,
  },
});
