# PacDoge
A dogecoin themed Pac-Man clone.
# Running
You can run this from just opening the index.html file in a web browser. However, if your web browser is Google Chrome,
you will have a problem as soon as you pick up the Super Doge Coins. Google Chrome doesn't ever allow access to image
data that is coming from the file:// protocol, even when the Javascript making the requests lives on the same protocol.
As such, you'll have to fire it off in a web server of some kind. The simplest way to do this is via Python's
SimpleHTTPServer.
    # cd PacDoge
    # python -m SimpleHTTPServer
    Serving HTTP on 0.0.0.0 port 8000 ...
Now you just have to navigate your browser over to http://localhost:8000/ to play the game.

Firefox works by just opening the index.html in the browser.

# Playing
Use the arrow keys to move arround. You can block yourself against a wall, so take care that you don't hit the key too
soon before your turn.
