# loop to clean the database file
for FILE in src/local-storage/sqlite/*.db;  do
  echo > $FILE
  git add $FILE
done