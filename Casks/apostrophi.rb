cask "apostrophi" do
  arch arm: "arm64", intel: "x64"

  version "1.0.1"
  sha256 arm:   "31daf3704752d95727c595456903c3fe5dd0e71cd011785aa2e145c543128a60",
         intel: "aff6291762b80183330253a0317c1132d930a1c8d8ad86af695746bcbcabe442"

  url "https://github.com/apostrophi/apostrophi/releases/download/v#{version}/Apostrophi-#{version}-#{arch}.dmg"
  name "Apostrophi"
  desc "Local-first archive for things you save from the web"
  homepage "https://github.com/apostrophi/apostrophi"

  livecheck do
    url :url
    strategy :github_latest
  end

  depends_on macos: :ventura

  app "Apostrophi.app"

  zap trash: [
    "~/Library/Application Support/apostrophi",
    "~/Library/Logs/apostrophi",
    "~/Library/Preferences/so.apostrophi.desktop.plist",
  ]
end
