describe('VAST Extension', function() {

    var VastExtension,
        mockExtensionNodes = {
            "Property": [
                {
                    "nodeValue": 1234,
                    "@id": "skid"
                },
                {
                    "nodeValue": 5678,
                    "@id": "apid"
                }
            ],
            "CustomTrackingEvents": {
                "CustomTracking": [
                    {
                        "nodeValue": "http://example.com/viewable_imp",
                        "@event": "viewableImpression"
                    },
                    {
                        "nodeValue": "http://example.com/pp_imp1",
                        "@event": "pp_imp"
                    },
                    {
                        "nodeValue": "http://example.com/pp_lb_play",
                        "@event": "pp_lb_play"
                    }
                ]
            }
        };

    beforeEach(function(done) {
        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();

            injector
                .require(['model/vastExtension', 'mocks'], function(module, mocks) {
                    VastExtension = module;
                    done();
                });
        });
    });

    describe('extensions', function() {
        it('stores the extension nodes on construction and returns them when called getExtension()', function() {
            var vastExtension = new VastExtension(mockExtensionNodes);

            expect(vastExtension.getExtensionNodes()).to.deep.equal(mockExtensionNodes);
        });

        it("returns the part of the stored extension nodes by the specified object path", function () {
            var vastExtension = new VastExtension(mockExtensionNodes);

            expect(vastExtension.getDetailsByPath('Property')).to.deep.equal([{
                    "nodeValue": 1234,
                    "@id": "skid"
                },
                {
                    "nodeValue": 5678,
                    "@id": "apid"
                }]);
        });
    });
});