db = db.getSiblingDB('city-lens')
db.createUser(
  {
    user: 'user',
    pwd: 'password',
    roles: [
      {
        role: 'readWrite',
        db: 'city-lens',
      },
    ],
  },
)