# Client reuse through 256t links

Assessed **2026-11-09 (America/Chicago)** against the GitHub default-branch
revisions linked below. This is a source-based compatibility assessment, not a
measured success rate or a claim that every pair has passed a browser test.
The scope includes embedding/rendering and reuse of source or data, as requested.

The agreed inventory is these **12 client repositories**. HashBin and 256t.org
are supporting infrastructure; this repository's demo is not a separate repo.
The older ten-app migration list omits gripeline and notebooks.

## Reading the scores

**Row = consuming repo; column = producing repo.** For example, the cell at
ManimOnline → modl asks whether ManimOnline can use a document saved by modl.
The producer supplies content identified by a 256t CID; the consumer retrieves
and verifies that content, then uses the representation it actually supports.
A CID identifies bytes, not their language, safety, dependencies or renderer.

Scores describe the strongest **intentional, existing route** for that pair,
subject to the conditions below. A subset route does not imply that all of the
producer's documents work. These are ordinal levels on a 0–100 scale, not
percentages of documents supported. Arbitrary new user-written fetch/translation
code, manual copy/paste, ordinary outbound hyperlinks and accidental acceptance
of a foreign envelope do not raise a score. Compressed links such as `#v1.…`
and `#h1=…` are not themselves 256t CIDs.

| Score | Meaning |
| --- | --- |
| 0 | No intentional reuse or embedding route established for the producer's saved representation. This does not mean implementation is impossible. |
| 20 | Existing verified CID text/byte access can treat the foreign document as opaque data. No foreign schema, renderer or execution support is implied. |
| 40 | An intentional adapter extracts useful source/data, but needs further conversion or loses significant state. Reserved for such evidence; no current pair is assigned this level. |
| 60 | A useful native subset or dedicated handoff works, with language, state, environment or packaging restrictions. |
| 80 | Native saved-document loading/reuse preserves the consumer's defined shareable state. Cross-repo embedding, a reusable result protocol and dependency portability remain unestablished. |
| 100 | Complete supported composition path: verified content and dependencies, declared capabilities, isolated rendering/execution, bounded results, lifecycle/error handling and demonstrated cross-repo embedding. No current pair has this evidence. |

The diagonal uses the same rubric: **80 means native CID round trips, not
universal embedding support**. Native loading does not imply that Publish is
registered/enabled, that stored content remains available forever, or that every
external package/asset works offline. Notebook Online's README still identifies
registration and canonical hosting as separate launch work.

## Compatibility matrix

Each cell is a score out of 100. Conditions and source evidence follow the table.

| Consumer ↓ / Producer → | apptron | AudioOnline | GnuplotOnline | gripeline | livelier | ManimOnline | modl | notebooks | pages | PythonOnline | R | sheets |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| apptron | 80 | 20 | 20 | 60 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 |
| AudioOnline | 0 | 80 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| GnuplotOnline | 0 | 0 | 80 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| gripeline | 20 | 20 | 20 | 80 | 20 | 60 | 60 | 20 | 20 | 20 | 20 | 20 |
| livelier | 0 | 0 | 0 | 0 | 80 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ManimOnline | 0 | 0 | 0 | 60 | 0 | 80 | 60 | 0 | 0 | 0 | 0 | 0 |
| modl | 0 | 0 | 0 | 60 | 0 | 0 | 80 | 0 | 0 | 0 | 0 | 0 |
| notebooks | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 80 | 0 | 0 | 0 | 0 |
| pages | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 80 | 0 | 0 | 0 |
| PythonOnline | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 80 | 20 | 20 |
| R | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 80 | 20 |
| sheets | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 80 |

### Conditions behind the nonzero cells

- **Every diagonal (80):** the production adapter understands its own saved
  schema or supported legacy representation. The score covers that shareable
  document, not transient engine state, every import format's metadata, or
  credentials. The adapter links in the inventory below establish this boundary.
- **PythonOnline → every foreign producer (20):** its built-in
  [`t256.text`](https://github.com/curtcox/PythonOnline/blob/6407c7febef755951ae72638598fd798168122ca/src/py/t256.py)
  retrieves verified UTF-8 text, including a foreign JSON envelope. Its
  `source` helper unwraps only Python documents. `function`/`call` execute Python;
  they do not supply R, Manim, Audio, notebook or other app runtimes. This credit
  covers text access only, not safe loading of arbitrarily large content or
  preservation of a foreign document's semantics.
- **R → every foreign producer (20):**
  [`t256$text` and its bridge](https://github.com/curtcox/R/blob/daf9ac1e7818f1a642aea5f11f87c91b99b7b95e/src/t256-bridge.js)
  provide verified UTF-8 text and reject CIDs declaring more than 5 MiB. That
  declaration check does not establish bounded collection of a hostile response.
  The source helper rejects foreign `hashbin-diagram` types; saved-function
  execution remains R only. The bridge accepts a CID, so extract the CID from a
  sibling editor link first.
- **gripeline → foreign producers (20, except its 60 cells):**
  [`t256:CID` file nodes](https://github.com/curtcox/gripeline/blob/9235d08885c415f563a66c7db1d679311e81e7e5/README.md#editor-and-portable-execution)
  emit `t256 load CID`. This is opaque input data in an explicitly run pipeline,
  not a foreign document renderer in the browser editor. Native execution needs
  Python, Bash, t256 and the pipeline's commands; Apptron needs the corresponding
  overlay/snapshot. Availability and size limits still apply.
- **apptron → foreign producers (20, except gripeline):** the existing
  [gripeline overlay](https://github.com/curtcox/apptron/blob/f7332cd4a35d425e0f1f6c731ec53cea2a77d142/docs/implementation.md#gripeline-overlay)
  includes native t256. This is conditional byte access from the guest, with
  content already in its local CID store or an explicitly configured network
  relay/provider. The VM has no network by default. Pasting a foreign app's CID
  into the Apptron editor does **not** turn it into a valid txtar snapshot.
- **apptron → gripeline (60):** gripeline's
  [Apptron target](https://github.com/curtcox/gripeline/blob/9235d08885c415f563a66c7db1d679311e81e7e5/web/src/run-targets.js)
  creates an Apptron txtar snapshot containing the checked compiler, diagram and
  verified CID inputs. Its
  [publishing path](https://github.com/curtcox/gripeline/blob/9235d08885c415f563a66c7db1d679311e81e7e5/web/src/publishing.js)
  can save that snapshot and produce an Apptron CID link. Use this generated
  snapshot, not a diagram CID directly. The 1 MiB snapshot limit, available VM
  commands and explicit execution limit the route. The ordinary compressed
  Apptron handoff alone would not earn CID interoperability credit.
- **gripeline → modl / ManimOnline (60):** its
  [verified loader and diagram reader](https://github.com/curtcox/gripeline/blob/9235d08885c415f563a66c7db1d679311e81e7e5/web/src/cid.js)
  extract source and positions. MODL or Graphviz source must also satisfy
  gripeline's pipeline rules and tool requirements. Manim Python scenes do not
  become pipelines; rendering a diagram does not prove it can execute. Manim's
  other settings are not preserved as a reusable renderer contract.
- **ManimOnline → modl / gripeline (60):** Manim's
  [legacy diagram readers](https://github.com/curtcox/ManimOnline/blob/84aae9a020efa4a8cd26fae4e7d0e1fb378db8b9/src/fragment-config.mjs)
  accept the untyped `hashbin-diagram` representation emitted by both clients.
  This supports their compatible MODL subset, with source and positions. Current
  MODL-specific presentation fields need not survive. An untyped gripeline DOT
  save is not a reliable Graphviz interchange contract: the legacy reader assigns
  MODL to an untyped envelope. No shell execution or Apptron snapshot support is
  implied.
- **modl → gripeline (60):** gripeline's ordinary saved diagram uses the same
  untyped envelope; the
  [MODL adapter](https://github.com/curtcox/modl/blob/afa751117cd2d8d8bd25022ade0f1d7762212af5/js/fragment-config.js)
  reads its source and positions. Only MODL diagrams qualify, not DOT diagrams
  or the separate Apptron snapshot. Execution semantics remain with gripeline.

### Why other plausible pairs remain zero

The shared kit's [envelope reader](src/core/envelope.js) rejects a
`hashbin-diagram` document with a different, unregistered type. Sharing a
compression algorithm, `src` field, Python engine or CID service is insufficient.
For example, modl does not register Manim's typed MODL envelope, even though
Manim reads modl's untyped envelope. This explains that asymmetric pair.

Audio has [verified WAV sample loading](https://github.com/curtcox/AudioOnline/blob/c1a22c43ccd4c384184713cb94093744162740d1/src/fragment-config.mjs),
but a saved audio **scene** is not a WAV. Sheets has
[verified Org numeric inputs](https://github.com/curtcox/sheets/blob/4e1228872668a8300c82917797775d995df7edd1/src/formats/org/inputs.js)
and image-CID support, but these do not import a foreign app's saved program.
Those are valuable foundations for future exported-result reuse.

Notebook Online imports Jupyter, marimo, Jupytext, Quarto and MyST, but its
[import dispatcher](https://github.com/curtcox/notebooks/blob/b2f10f11d96164c1dca64f7c885254588fc6cf1d/src/formats/sniff.js)
rejects other apps' typed kit envelopes. A raw Quarto or percent-script CID could
work without establishing support for Sheets or PythonOnline's saved schema.
R source preservation in notebook formats does not enable R execution.

Pages can render HTML/Markdown projects in its isolated preview, but its
[preview host protocol](https://github.com/curtcox/pages/blob/2a2905fd28cf79e60c0299e7cbe3de64375b7b2c/src/preview-host.js)
receives rendered HTML from its own parent; it is not a general CID embed API.
An HTML iframe or user-written fetch is not evidence that another editor permits
framing or offers usable output. Canonical header policies and runtime origin
requirements need separate verification.

## Client inventory and reproducible evidence

These revisions matched each repository's remote default-branch head when
checked for this assessment. Links pin the production adapter rather than a
wire-test adapter. Local sibling checkouts can be older. No deployment or
release status is inferred from a source revision.

| Repo | Kit pin in reviewed source | Saved representation / primary evidence at reviewed revision |
| --- | --- | --- |
| [apptron](https://github.com/curtcox/apptron) | v0.3.5 | [f7332cd4a35d: adapter](https://github.com/curtcox/apptron/blob/f7332cd4a35d425e0f1f6c731ec53cea2a77d142/src/fragment-config.js); typed Apptron envelope containing validated txtar |
| [AudioOnline](https://github.com/curtcox/AudioOnline) | v0.3.5 | [c1a22c43ccd4: adapter](https://github.com/curtcox/AudioOnline/blob/c1a22c43ccd4c384184713cb94093744162740d1/src/fragment-config.mjs); `hashbin-audio`, notation/settings/files |
| [GnuplotOnline](https://github.com/curtcox/GnuplotOnline) | v0.3.5 | [9b589a485ed1: adapter](https://github.com/curtcox/GnuplotOnline/blob/9b589a485ed11e2f958e2e6a4f998ac562320e6b/src/fragment-config.mjs); `gnuplot`, dimensions/background/data files |
| [gripeline](https://github.com/curtcox/gripeline) | v0.3.5 | [9235d08885c4: publishing](https://github.com/curtcox/gripeline/blob/9235d08885c415f563a66c7db1d679311e81e7e5/web/src/publishing.js); untyped diagram source/positions or a separately generated typed Apptron snapshot |
| [livelier](https://github.com/curtcox/livelier) | v0.3.5 | [79aac5146865: adapter](https://github.com/curtcox/livelier/blob/79aac5146865b8ef8f34d61cfff157e56caf2776/src/fragment-config.mjs); `livelier`, source/kernel/world/autorun |
| [ManimOnline](https://github.com/curtcox/ManimOnline) | v0.3.5 | [84aae9a020ef: adapter](https://github.com/curtcox/ManimOnline/blob/84aae9a020efa4a8cd26fae4e7d0e1fb378db8b9/src/fragment-config.mjs); language-specific legacy diagram envelope plus Manim settings |
| [modl](https://github.com/curtcox/modl) | v0.3.5 | [afa751117cd2: adapter](https://github.com/curtcox/modl/blob/afa751117cd2d8d8bd25022ade0f1d7762212af5/js/fragment-config.js); untyped diagram envelope, positions and MODL presentation fields |
| [notebooks](https://github.com/curtcox/notebooks) | v0.4.3 | [b2f10f11d961: adapter](https://github.com/curtcox/notebooks/blob/b2f10f11d96164c1dca64f7c885254588fc6cf1d/src/fragment-config.mjs) and [CID importer](https://github.com/curtcox/notebooks/blob/b2f10f11d96164c1dca64f7c885254588fc6cf1d/src/hashbin.mjs); `notebook` or recognized raw notebook formats |
| [pages](https://github.com/curtcox/pages) | v0.3.5 | [2a2905fd28cf: adapter](https://github.com/curtcox/pages/blob/2a2905fd28cf79e60c0299e7cbe3de64375b7b2c/src/fragment-config.mjs); `pages`, entry source and validated multi-file project |
| [PythonOnline](https://github.com/curtcox/PythonOnline) | v0.4.3 | [6407c7febef7: adapter](https://github.com/curtcox/PythonOnline/blob/6407c7febef755951ae72638598fd798168122ca/src/fragment-config.mjs); `python`, source/stdin/autorun |
| [R](https://github.com/curtcox/R) | v0.4.3 | [daf9ac1e7818: adapter](https://github.com/curtcox/R/blob/daf9ac1e7818f1a642aea5f11f87c91b99b7b95e/src/fragment-config.mjs); `r`, source/stdin/autorun |
| [sheets](https://github.com/curtcox/sheets) | v0.3.5 | [4e1228872668: adapter](https://github.com/curtcox/sheets/blob/4e1228872668a8300c82917797775d995df7edd1/src/fragment-config.js); `sheets-document`, format/profile/view, optional input snapshot/attachments |

## Proposed Fragment Kit mechanisms

Everything in this section is a proposal. This change adds documentation only.
Consumer document adapters, execution engines and isolation remain consumer-owned,
as required by [the runtime contracts](docs/contracts.md).

### 1. Declare producer and consumer capabilities

Add an optional, versioned **data-only capability manifest** and a kit validator.
Declare exact app URLs/origins/paths, document types/versions, accepted input
representations, exported media types, size limits, supported operations
(`inspect`, `import`, `embed`, `run`, `export`) and the required runtime profile.
Do not download adapter code or engines from a linked manifest. Consumer code
registers its own pinned adapters and renderer implementations.

Use it for an “Open with / Insert from link” chooser that explains support and
losses before acting. Separate the publisher's identity from the document's
language: a gripeline-produced MODL document can be drawn in modl; a Python
document does not promise the Audio or Manim APIs. This should first address the
Manim/modl/gripeline envelope asymmetry and advertise notebook import profiles.

### 2. Build a common link resolver around existing verified bytes

Reuse [core/content.js](src/core/content.js), CID validation, bounded decoding and
the existing document registry. Add a supported public resolver that accepts a
bare CID, `https://256t.us/<cid>`, or a registered sibling editor's CID URL and
returns verified bytes plus an inspected, validated descriptor. Keep byte loading
separate from schema conversion. Validate exact approved origins **and paths**,
HTTPS, ports, credentials and redirects; never fetch arbitrary destinations
supplied by a document. Keep retrieval providers explicit and errors visible.

Do not merely add every sibling hostname to every `allowedHosts` array: that
would permit URL parsing without implementing foreign schemas. Preview detected
type, source app, dependencies and intended action. Invalid explicit links must
leave the current document intact, and edits/navigation must invalidate late
loads. Loading must never execute code, call a model or spend money.

### 3. Provide adapter plumbing with explicit conversion reports

Add a small adapter interface for `accepts`, `inspect`, `convert` and `losses`,
with conversion implemented and validated in the client repo. Preserve original
verified bytes/CID and provenance; converted content has a new identity. Require
explicit user acceptance before replacing a document, inserting cells or running
anything. Reject unsupported versions/types instead of silently stripping fields.

Start with MODL source/positions between modl, Manim and gripeline, including
language identity and presentation losses. Next add PythonOnline source/stdin to
an explicitly created notebook Python cell, and Sheets Quarto to notebook cells.
Neither path should imply that every Python package is available. Preserve R
cells as data while Notebook Online's R execution remains disabled.

### 4. Define portable results, separate from executable documents

Add a bounded result descriptor and validation helpers: source CID, named output,
media type, output CID, byte length, producer/runtime version and optional input
CIDs. Exports should use common representations such as PNG, inert SVG, WAV,
UTF-8 text, CSV or typed JSON, with client validators for actual content.

This makes useful first targets concrete: Gnuplot/Manim images in Pages or
notebooks; Audio WAV results consumed by Audio's sample loader or a media player;
Sheets tables/constants consumed by Python/R; Python/R tables and plots inserted
into Sheets/notebooks. A saved scene/program CID must not be mislabeled as its
rendered output. Text/JSON results are data; active HTML/SVG require appropriate
isolation. No result from a model or program becomes executable implicitly.

### 5. Offer an optional isolated embed protocol

Supply a kit host helper and a small versioned MessagePort protocol. Each client
implements its own dedicated `/embed` view and retains its execution sandbox.
Keep editors and credentials outside the embedded user content. Use exact parent
origin allowlists, verify the initiating window, validate bounded messages, and
bind requests to a fresh session and document revision. Do not rely on an opaque
child's `null` origin as authentication. Bound resize, output and error messages;
support ready, cancel, timeout and teardown.

Default to a static preview or explicit “Load/Run” action. Render code only after
the relevant user action; do not grant storage, network, camera, microphone or AI
access just because a document is embedded. Dedicated endpoint CSP,
`frame-ancestors`, permissions and any COOP/COEP requirements need to be implemented
and tested on the actual hosts. A blocked frame gets a visible explanation and
an explicit open-in-app alternative. Do not weaken the main editor's framing
policy to make a generic iframe appear to work.

Pages and notebooks are useful first hosts; static graph/image/audio output is
the first target. Interactive Livelier worlds and Apptron VMs need their own
resource, input, network and lifecycle policies before earning equivalent support.

### 6. Package dependencies in a data-only composition manifest

Define an optional immutable manifest listing child CIDs, expected types/media,
named inputs/outputs, runtime profiles, fallback previews and provenance. Include
per-item and aggregate byte limits, depth/node-count limits, cycle detection and
timeouts. Verify declared lengths and CIDs before decoding, on cache writes and
on reads. Prefix all caches/storage; a content hash does not guarantee retention.
Show missing/expired dependencies and allow an explicit portable export.

Use gripeline's existing Apptron snapshot packaging and Sheets' verified input
snapshots as consumer examples. The kit can help traverse/validate a bounded
dependency graph; consumers still decide which attachments, packages and engines
are valid. Manifests carry no scripts, credentials, mutable engine URLs or hidden
authority. Show data destinations before consent; host access and budgets remain
per-app, with no silent connection fallback. Publication keeps the existing
synchronous click/initialized-SDK contract and HashBin-origin approval.

### 7. Generate future scores from cross-client fixtures

Add a small fixture per producer representation and operation, including foreign
types, wrong hashes, oversized content, stale loads, missing dependencies and
blocked frames. Test native imports for state preservation and declared losses;
test embeds on separate origins with actual client engines. Keep opaque byte
access, conversion, rendering, execution and embedding as separate evidence.

A future machine-readable assessment could generate this matrix while retaining
the rubric, conditions, reviewed revisions and test receipts. Record browser names
that actually ran, deployment URLs separately from source revisions, and dates.
CI should use inline CIDs or local fixtures, require no paid calls, and never
count mocked framing policy as deployed embedding acceptance.

## Suggested implementation order

1. Add capability declarations and resolver/adapter plumbing; prove the three
   diagram clients can exchange typed source and positions with visible losses.
2. Add portable result descriptors and demonstrate a graph image, WAV and table
   flowing into Pages/notebooks/Sheets without foreign code execution.
3. Add the dedicated embed protocol and real cross-origin browser fixtures for
   those static targets, then the consumer-owned interactive runtimes.
4. Add bounded dependency packaging and generate score updates from receipts.

Those changes can raise opaque-data cells toward useful import/render support,
then raise verified composition paths toward 100. Improving the kit alone does
not raise a client's score: the client must adopt the mechanism and demonstrate
the relevant operation.
