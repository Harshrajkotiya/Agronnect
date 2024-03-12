export const defaultSettings = [
  {
    lastSeen: false,
    readReceipt: false,
    joiningGroups: false,
    privateMessages: false,
    darkMode: false,
    borderedTheme: false,
    allowNotifications: false,
    keepNotifications: false,
  },
];

export const user = {
  id: 1,
  firstName: "Dawn",
  lastSeen: new Date(),
  lastName: "Sabrina",
  email: "sabrina@gmail.com",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
  token: "fakeToken",
  contacts: [
    {
      id: 2,
      email: "user@gmail.com",
      firstName: "Ahmed",
      lastName: "Ali",
      lastSeen: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
    {
      id: 3,
      email: "user@gmail.com",
      firstName: "Allen",
      lastName: "Carr",
      lastSeen: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    },
    {
      id: 4,
      email: "user@gmail.com",
      firstName: "Dawn",
      lastName: "Sabrina",
      lastSeen: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1657214059233-5626b35eb349?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=436&q=80",
    },
    {
      id: 5,
      email: "user@gmail.com",
      firstName: "Dylan",
      lastName: "Billy",
      lastSeen: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
    {
      id: 6,
      email: "user@gmail.com",
      firstName: "Elijah",
      lastName: "Sabrina",
      lastSeen: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
    {
      id: 7,
      email: "user@gmail.com",
      firstName: "Emma",
      lastName: "Layla",
      lastSeen: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
    {
      id: 8,
      email: "user@gmail.com",
      firstName: "Evelyn",
      lastName: "Billy",
      lastSeen: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 9,
      email: "user@gmail.com",
      firstName: "Feng",
      lastName: "Zhuo",
      lastSeen: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
    {
      id: 10,
      email: "user@gmail.com",
      firstName: "Fung",
      lastName: "Sheng",
      lastSeen: new Date(),
      avatar:
        "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?cs=srgb&dl=pexels-charles-1851164.jpg&fm=jpg",
    },
  ],
};

export const conversations = [
  {
    id: 4,
    type: "couple",
    unread: 2,
    draftMessage: "",
    contacts: [
      {
        id: 6,
        email: "user@gmail.com",
        firstName: "Elijah",
        lastName: "Sabrina",
        lastSeen: new Date(),
        avatar:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },

      {
        id: 359,
        email: "user@gmail.com",
        firstName: "Test dev",
        lastName: "Test Dev",
        lastSeen: new Date(),
        avatar:
          "https://community.canvaslms.com/legacyfs/online/avatars/a130158_lattke-profile-pic-tall.png",
      },

      {
        id: 1,
        firstName: "Dawn",
        lastName: "Sabrina",
        lastSeen: new Date(),
        email: "sabrina@gmail.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },
    ],
    messages: [
      {
        id: 1,
        content: "Lorem ipsum dolor sit amet.",
        date: "3:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 14,
        content: "Lorem ipsum dolor sit amet.",
        date: "4:00 pm",
        state: "sent",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 1,
      },
      {
        id: 3,
        content: "Lorem ipsum dolor sit amet.",
        date: "3:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 2,
      },
      {
        id: 4,
        content: "Check this out https://github.com/",
        date: "4:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        previewData: {
          link: "https://github.com/",
          title: "Github",
          image:
            "https://github.blog/wp-content/uploads/2021/01/102393310-07478b80-3f8d-11eb-84eb-392d555ebd29.png?fit=1200%2C630",
          description:
            "GitHub is where over 83 million developers shape the future of software, together. Contribute to the open source community",
          domain: "github.com",
        },
      },
      {
        id: 5,
        content: "Lorem ipsum dolor sit amet.",
        date: "5:00 pm",
        state: "delivered",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        attachments: [
          {
            id: 3,
            type: "image",
            name: "mountain.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664091729644-07a158d7c4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
          },
          {
            id: 2,
            type: "image",
            name: "pumkins.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664031315855-955dbca83172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
          {
            id: 1,
            type: "image",
            name: "forest.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664021975758-78d83898225d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
          },
        ],
        replyTo: 4,
      },
      {
        id: 6,
        date: "5:30 pm",
        state: "read",
        attachments: [
          {
            id: 4,
            type: "file",
            name: "lecture-10.pdf",
            size: "54.5 MB",
            url: "https://losalamos.unm.edu/forms/study-methods.pdf",
          },
        ],
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 7,
        date: "6:00 pm",
        state: "read",
        attachments: [
          {
            id: 5,
            type: "video",
            name: "fun-video.mp4",
            size: "11.4 MB",
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            thumbnail:
              "https://images.unsplash.com/photo-1559705421-4ae9bf6fabb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
          {
            id: 12,
            type: "video",
            name: "awesome-video.mp4",
            size: "11.4 MB",
            url: "https://assets.mixkit.co/videos/preview/mixkit-small-flowering-plants-in-a-nursery-43709-large.mp4",
            thumbnail:
              "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
        ],
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 8,
        type: "recording",
        state: "waiting",
        content: {
          id: 1,
          size: "10 MB",
          src: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "23s",
        },
        date: "6:20 pm",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
    ],
  },
  {
    id: 1,
    type: "couple",
    unread: 2,
    draftMessage: "",
    contacts: [
      {
        id: 6,
        email: "user@gmail.com",
        firstName: "Elijah",
        lastName: "Sabrina",
        lastSeen: new Date(),
        avatar:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },

      {
        id: 359,
        email: "user@gmail.com",
        firstName: "Test dev",
        lastName: "Test Dev",
        lastSeen: new Date(),
        avatar:
          "https://community.canvaslms.com/legacyfs/online/avatars/a130158_lattke-profile-pic-tall.png",
      },

      {
        id: 1,
        firstName: "Dawn",
        lastName: "Sabrina",
        lastSeen: new Date(),
        email: "sabrina@gmail.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },
    ],
    messages: [
      {
        id: 1,
        content: "Lorem ipsum dolor sit amet.",
        date: "3:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 14,
        content: "Lorem ipsum dolor sit amet.",
        date: "4:00 pm",
        state: "sent",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 1,
      },
      {
        id: 356,
        content: "Lorem ipsum dolor sit amet.",
        date: "4:00 pm",
        state: "sent",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 1,
      },
      {
        id: 3,
        content: "Lorem ipsum dolor sit amet.",
        date: "3:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 2,
      },
      {
        id: 4,
        content: "Check this out https://github.com/",
        date: "4:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        previewData: {
          link: "https://github.com/",
          title: "Github",
          image:
            "https://github.blog/wp-content/uploads/2021/01/102393310-07478b80-3f8d-11eb-84eb-392d555ebd29.png?fit=1200%2C630",
          description:
            "GitHub is where over 83 million developers shape the future of software, together. Contribute to the open source community",
          domain: "github.com",
        },
      },
      {
        id: 5,
        content: "Lorem ipsum dolor sit amet.",
        date: "5:00 pm",
        state: "delivered",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        attachments: [
          {
            id: 3,
            type: "image",
            name: "mountain.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664091729644-07a158d7c4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
          },
          {
            id: 2,
            type: "image",
            name: "pumkins.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664031315855-955dbca83172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
          {
            id: 1,
            type: "image",
            name: "forest.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664021975758-78d83898225d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
          },
        ],
        replyTo: 4,
      },
      {
        id: 6,
        date: "5:30 pm",
        state: "read",
        attachments: [
          {
            id: 4,
            type: "file",
            name: "lecture-10.pdf",
            size: "54.5 MB",
            url: "https://losalamos.unm.edu/forms/study-methods.pdf",
          },
        ],
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 7,
        date: "6:00 pm",
        state: "read",
        attachments: [
          {
            id: 5,
            type: "video",
            name: "fun-video.mp4",
            size: "11.4 MB",
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            thumbnail:
              "https://images.unsplash.com/photo-1559705421-4ae9bf6fabb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
          {
            id: 12,
            type: "video",
            name: "awesome-video.mp4",
            size: "11.4 MB",
            url: "https://assets.mixkit.co/videos/preview/mixkit-small-flowering-plants-in-a-nursery-43709-large.mp4",
            thumbnail:
              "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
        ],
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 8,
        type: "recording",
        state: "waiting",
        content: {
          id: 1,
          size: "10 MB",
          src: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "23s",
        },
        date: "6:20 pm",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
    ],
  },
  {
    id: 356,
    type: "couple",
    unread: 2,
    draftMessage: "",
    contacts: [
      {
        id: 6,
        email: "user@gmail.com",
        firstName: "Elijah",
        lastName: "Sabrina",
        lastSeen: new Date(),
        avatar:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },

      {
        id: 359,
        email: "user@gmail.com",
        firstName: "Test dev",
        lastName: "Test Dev",
        lastSeen: new Date(),
        avatar:
          "https://community.canvaslms.com/legacyfs/online/avatars/a130158_lattke-profile-pic-tall.png",
      },

      {
        id: 1,
        firstName: "Dawn",
        lastName: "Sabrina",
        lastSeen: new Date(),
        email: "sabrina@gmail.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },
    ],
    messages: [
      {
        id: 1,
        content: "Lorem ipsum dolor sit amet.",
        date: "3:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 14,
        content: "Lorem ipsum dolor sit amet.",
        date: "4:00 pm",
        state: "sent",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 1,
      },
      {
        id: 356,
        content: "Lorem ipsum dolor sit amet.",
        date: "4:00 pm",
        state: "sent",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 1,
      },
      {
        id: 3,
        content: "Lorem ipsum dolor sit amet.",
        date: "3:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 2,
      },
      {
        id: 4,
        content: "Check this out https://github.com/",
        date: "4:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        previewData: {
          link: "https://github.com/",
          title: "Github",
          image:
            "https://github.blog/wp-content/uploads/2021/01/102393310-07478b80-3f8d-11eb-84eb-392d555ebd29.png?fit=1200%2C630",
          description:
            "GitHub is where over 83 million developers shape the future of software, together. Contribute to the open source community",
          domain: "github.com",
        },
      },
      {
        id: 5,
        content: "Lorem ipsum dolor sit amet.",
        date: "5:00 pm",
        state: "delivered",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        attachments: [
          {
            id: 3,
            type: "image",
            name: "mountain.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664091729644-07a158d7c4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
          },
          {
            id: 2,
            type: "image",
            name: "pumkins.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664031315855-955dbca83172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
          {
            id: 1,
            type: "image",
            name: "forest.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664021975758-78d83898225d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
          },
        ],
        replyTo: 4,
      },
      {
        id: 6,
        date: "5:30 pm",
        state: "read",
        attachments: [
          {
            id: 4,
            type: "file",
            name: "lecture-10.pdf",
            size: "54.5 MB",
            url: "https://losalamos.unm.edu/forms/study-methods.pdf",
          },
        ],
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 7,
        date: "6:00 pm",
        state: "read",
        attachments: [
          {
            id: 5,
            type: "video",
            name: "fun-video.mp4",
            size: "11.4 MB",
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            thumbnail:
              "https://images.unsplash.com/photo-1559705421-4ae9bf6fabb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
          {
            id: 12,
            type: "video",
            name: "awesome-video.mp4",
            size: "11.4 MB",
            url: "https://assets.mixkit.co/videos/preview/mixkit-small-flowering-plants-in-a-nursery-43709-large.mp4",
            thumbnail:
              "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
        ],
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 8,
        type: "recording",
        state: "waiting",
        content: {
          id: 1,
          size: "10 MB",
          src: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "23s",
        },
        date: "6:20 pm",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
    ],
  },
  {
    id: 361,
    type: "couple",
    unread: 2,
    draftMessage: "",
    contacts: [
      {
        id: 6,
        email: "user@gmail.com",
        firstName: "Elijah",
        lastName: "Sabrina",
        lastSeen: new Date(),
        avatar:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },

      {
        id: 359,
        email: "user@gmail.com",
        firstName: "Test dev",
        lastName: "Test Dev",
        lastSeen: new Date(),
        avatar:
          "https://community.canvaslms.com/legacyfs/online/avatars/a130158_lattke-profile-pic-tall.png",
      },

      {
        id: 1,
        firstName: "Dawn",
        lastName: "Sabrina",
        lastSeen: new Date(),
        email: "sabrina@gmail.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      },
    ],
    messages: [
      {
        id: 1,
        content: "Lorem ipsum dolor sit amet.",
        date: "3:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 14,
        content: "Lorem ipsum dolor sit amet.",
        date: "4:00 pm",
        state: "sent",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 1,
      },
      {
        id: 356,
        content: "Lorem ipsum dolor sit amet.",
        date: "4:00 pm",
        state: "sent",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 1,
      },
      {
        id: 3,
        content: "Lorem ipsum dolor sit amet.",
        date: "3:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        replyTo: 2,
      },
      {
        id: 4,
        content: "Check this out https://github.com/",
        date: "4:00 pm",
        state: "read",
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        previewData: {
          link: "https://github.com/",
          title: "Github",
          image:
            "https://github.blog/wp-content/uploads/2021/01/102393310-07478b80-3f8d-11eb-84eb-392d555ebd29.png?fit=1200%2C630",
          description:
            "GitHub is where over 83 million developers shape the future of software, together. Contribute to the open source community",
          domain: "github.com",
        },
      },
      {
        id: 5,
        content: "Lorem ipsum dolor sit amet.",
        date: "5:00 pm",
        state: "delivered",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
        attachments: [
          {
            id: 3,
            type: "image",
            name: "mountain.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664091729644-07a158d7c4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
          },
          {
            id: 2,
            type: "image",
            name: "pumkins.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664031315855-955dbca83172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
          {
            id: 1,
            type: "image",
            name: "forest.jpg",
            size: "20 MB",
            url: "https://images.unsplash.com/photo-1664021975758-78d83898225d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
          },
        ],
        replyTo: 4,
      },
      {
        id: 6,
        date: "5:30 pm",
        state: "read",
        attachments: [
          {
            id: 4,
            type: "file",
            name: "lecture-10.pdf",
            size: "54.5 MB",
            url: "https://losalamos.unm.edu/forms/study-methods.pdf",
          },
        ],
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 7,
        date: "6:00 pm",
        state: "read",
        attachments: [
          {
            id: 5,
            type: "video",
            name: "fun-video.mp4",
            size: "11.4 MB",
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            thumbnail:
              "https://images.unsplash.com/photo-1559705421-4ae9bf6fabb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
          {
            id: 12,
            type: "video",
            name: "awesome-video.mp4",
            size: "11.4 MB",
            url: "https://assets.mixkit.co/videos/preview/mixkit-small-flowering-plants-in-a-nursery-43709-large.mp4",
            thumbnail:
              "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
          },
        ],
        sender: {
          id: 6,
          email: "user@gmail.com",
          firstName: "Elijah",
          lastName: "Sabrina",
          lastSeen: new Date(),
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
      {
        id: 8,
        type: "recording",
        state: "waiting",
        content: {
          id: 1,
          size: "10 MB",
          src: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "23s",
        },
        date: "6:20 pm",
        sender: {
          id: 1,
          firstName: "Dawn",
          lastName: "Sabrina",
          lastSeen: new Date(),
          email: "sabrina@gmail.com",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        },
      },
    ],
  },
];


export const archive = [];


export const notifications = [
  {
    flag: "security",
    title: "Recent Login",
    message: "there was a recent login to you account from this device",
  },
  {
    flag: "added-to-group",
    title: "New Group",
    message: "Your friend added you to a new group",
  },
  {
    flag: "account-update",
    title: "Password Reset",
    message: "Your password has been restored successfully",
  },
  {
    flag: "security",
    title: "Recent Login",
    message: "there was a recent login to you account from this device",
  },
  {
    flag: "added-to-group",
    title: "New Group",
    message: "Your friend added you to a new group",
  },
];
export const calls =[]

export const activeCall = {
  id: 6,
  type: "voice",
  status: "dialing",
  direction: "outgoing",
  date: "Dec 12, 2020",
  length: "01:12",
  members: [
    {
      id: 1,
      firstName: "Dawn",
      lastName: "Sabrina",
      lastSeen: new Date(),
      email: "sabrina@gmail.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
    {
      id: 8,
      email: "user@gmail.com",
      firstName: "Evelyn",
      lastName: "Billy",
      lastSeen: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
  ],
  adminIds: [1],
};
// export const activeCall = {};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchData = async () => {
  await delay(2000);

  return await {
    data: {
      user: user,
      conversations: conversations,
      notifications: notifications,
      archivedConversations: archive,
    },
  };
};

export const updateAccount = async () => {
  await delay(4000);

  return await {
    data: {
      detail: "Your account has been updated successfully",
    },
  };
};

export const attachments = [
  {
    id: 6,
    type: "image",
    name: "forest.jpg",
    size: "21 MB",
    url: "https://images.unsplash.com/photo-1664021975758-78d83898225d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 7,
    type: "image",
    name: "pumkins.jpg",
    size: "22 MB",
    url: "https://images.unsplash.com/photo-1664031315855-955dbca83172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 8,
    type: "image",
    name: "mountain.jpg",
    size: "23 MB",
    url: "https://images.unsplash.com/photo-1664091729644-07a158d7c4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 9,
    type: "file",
    name: "lecture-10.pdf",
    size: "52.4 MB",
    url: "https://images.unsplash.com/photo-1664091729644-07a158d7c4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 10,
    type: "video",
    name: "fun-video.mp4",
    size: "11.4 MB",
    url: "https://images.unsplash.com/photo-1559705421-4ae9bf6fabb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
];





export default {
  defaultSettings,
  archive,
  conversations,
  notifications,
  calls,
  activeCall,
  user,


} as const;