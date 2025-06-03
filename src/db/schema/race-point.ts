// import { geometry, integer, pgTable, serial } from 'drizzle-orm/pg-core';
// import race from './race';

// export default pgTable('race_point', {
//   id: serial().primaryKey().notNull(),
//   race: integer()
//     .notNull()
//     .references(() => race.id, {
//       onDelete: 'cascade',
//       onUpdate: 'cascade',
//     }),
//     location: geometry('location', {type: ''})
//   });
