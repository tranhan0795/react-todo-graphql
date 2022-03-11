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
  # clients can execute, along with the return type for each. 
  
  type Query {
    todos: [Todo]
  }

  type Mutation{
    addTodo(description: String):Todo
    deleteTodo(id:Int):Int
    updateTodo(id:Int,description:String,isFinished:Int):Todo
  }

`;


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    /**
    * query to get all todo 
    *@param db - db connection
    */
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
    /** 
    * add new todo to db
    *@param db - db connection
    *@param description - todo's description
    */
    addTodo: async (_, {description}, {db}) => {
      return new Promise((res, rej) => {
        db.query(`INSERT INTO todo SET ?`, {description}, (err, result) => {
          if (err) {
            rej(err);
          } else {
            res({
              id: result.insertId,
              isFinished: false,
              description
            });
          }
        });
      })
    },

    /**
     * delete one todo from db
     * @param todoId - todo's id to delete 
     * @param db - db connection
     */
    deleteTodo: async (_, {id}, {db}) => {
      return new Promise((res, rej) => {
        db.query(`DELETE FROM todo WHERE id = ?`, id, (err,result) => {
          if (err) {
            rej(err);
          } else {
            res(result.affectedRows);
          }
        });
      })
    },

    /**
     * delete one todo from db
     * @param todoId - todo's id to delete 
     * @param description - new description
     * @param isFinished - new isFinished
     * @param db - db connection
     */
    updateTodo: async (_, {id, description, isFinished}, {db}) => {
      return new Promise((res, rej) => {
        db.query(`UPDATE todo SET description = ?,isFinished = ?  WHERE id = ?`, [description, isFinished, id], (err) => {
          if (err) {
            rej(err);
          } else {
            res({id, description, isFinished});
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
  /* use context to pass db connection to resolvers */
  context: async () => ({
    db: await getDB()
  }),
  formatError: (err) => {
    if (err.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
    }
    return err;
  },
});

// The `listen` method launches a web server.
server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
