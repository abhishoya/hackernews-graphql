const { GraphQLServer } = require('graphql-yoga')

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }]
let idCount = links.length
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
    },
    Mutation: {
        postLink: (parent, args) => {
           const link = {
            id: `link-${idCount++}`,
            description: args.description,
            url: args.url,
          }
          links.push(link)
          return link
        },
        updateLink: (parent,args) => {
            for(i in links)
            {
                if(links[i].id===args.id)
                {
                    links[i].url=args.url
                    links[i].description=args.description
                    return links[i]
                }
            }
            return null
        },
        deleteLink: (parent,args) => {
            for(i in links)
            {
                const link = links[i];
                if(links[i].id===args.id)
                {        
                    links.splice(args.id);
                    return link;
                }
            }
            return null
        }
    },
}
  
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
