require "date"

score = 0
namespace :appcache do
  desc "update the date in the appcache file (in the gh-pages branch)"
  task :update do
    appcache = File.read("cache.appcache")
    updated  = "# Updated: #{DateTime.now}"

    File.write("cache.appcache", appcache.sub(/^# Updated:.*$/, updated))
  end
  desc "update the score in the appcache file (in the gh-pages branch)"
  task :score_update do
    appcache = File.read("cache.appcache")
    updated = "# Score: #{score}"
    
    File.write("cache.appcache", appcache.sub(/^# Updated:.*$/, updated))
  end
end
