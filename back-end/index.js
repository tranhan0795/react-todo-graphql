const {ApolloServer, gql} = require("apollo-server");
const {getDB} = require("./mysql");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Todo {
    id: Int
    description: String
    isFinished: Boolean
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    todos: [Todo]
  }

  type Mutation{
    addTodo(description: String):Int
    deleteTodo(todoId:Int):Boolean
    updateTodo(todoId:Int,description:String,isFinished:Int):Boolean
  }


`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    todos: async (_, __, {db}) => {

      return new Promise((resolve, reject) => {
        db.query("SELECT * FROM todo", (err, todos) => {
          if (err) {
            reject(err);
          } else {
            resolve(todos);
          }
        });
      });
    },
  },
  Mutation: {

    addTodo: async (_, {description}, {db}) => {
      return new Promise((res, rej) => {
        console.log(description);
        db.query(`INSERT INTO todo SET ?`, {description}, (err, result) => {
          if (err) {
            rej(err);
          } else {
            console.log(result);
            res(result.insertId);
          }
        });
      })
    },

    deleteTodo: async (_, {todoId}, {db}) => {
      return new Promise((res, rej) => {
        db.query(`DELETE FROM todo WHERE id = ?`, todoId, (err) => {
          if (err) {
            rej(err);
          } else {
            res(true);
          }
        });
      })
    },

    updateTodo: async (_, {todoId, description, isFinished}, {db}) => {
      return new Promise((res, rej) => {
        db.query(`UPDATE todo SET description = ?,isFinished = ?  WHERE id = ?`, [description, isFinished, todoId], (err) => {
          if (err) {
            rej(err);
          } else {
            res(true);
          }
        });
      })
    },

  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  /*
  */
  context: async () => ({
    db: await getDB()
  })
});

// The `listen` method launches a web server.
server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
