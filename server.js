
var fs = require('fs');
var crypto = require('crypto');
var inspect = require('util').inspect;
 
var ssh2 = require('ssh2');

const motd = fs.readFileSync("motd.txt");
const trap = fs.readFileSync("trap.txt");

const serverOpts = {
    hostKeys: [fs.readFileSync('host.key')]
};
let lastUsername = 'root';
new ssh2.Server(serverOpts, (client) => {
    console.log('[STATUS] Client connected!');
    
    client.on('authentication', function(ctx) {
        lastUsername = Buffer.from(ctx.username);

    
        switch (ctx.method) {
        case 'password':
            var password = Buffer.from(ctx.password);
            console.log(`[LOGIN] ${lastUsername} - ${password}`);
            return ctx.accept();
        default:
            return ctx.reject();
        }
    })
    .on('ready', function() {
        console.log('[STATUS] Client authenticated!');
    
        client.on('session', function(accept, reject) {
            var session = accept();

            session.once('shell', function(accept, reject, info) {
                var stream = accept();
                spring_trap(stream);
            });

            session.once('exec', function(accept, reject, info) {
                console.log('[STATUS] Client wants to execute: ' + inspect(info.command));
                var stream = accept();
                spring_trap(stream);
            });
        });
    }).on('end', function() {
        console.log('[STATUS] Client disconnected');
    });
})
.listen(process.env.PORT || 2222, '127.0.0.1', function() {
    console.log('[SERVER] Listening on port ' + this.address().port);
});

function spring_trap(stream) {
    console.log("[STATUS] Sprung trap");
    stream.write(`${lastUsername}@virgil:~ $ `)
    stream.on('data', function(_) {
        stream.write(trap);
        stream.write("\n");
        stream.exit(0);
        stream.end();
    });
}